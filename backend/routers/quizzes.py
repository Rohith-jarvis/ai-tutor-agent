from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from database import get_db
from models import Student, Quiz, Progress
from schemas import QuizGenerateRequest, QuizQuestionOut, QuizSubmitRequest, QuizSubmitResult
from auth import get_current_user
from services.ai_service import ai_service
import json

router = APIRouter(prefix="/quizzes", tags=["Quiz Generator"])

@router.post("/generate", response_model=List[QuizQuestionOut])
def generate_quiz(
    payload: QuizGenerateRequest,
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Try fetching existing questions from DB or generate dynamically via AI service
    db_quizzes = db.query(Quiz).filter(
        Quiz.subject_name == payload.subject,
        Quiz.difficulty == payload.difficulty
    ).limit(payload.num_questions).all()

    if len(db_quizzes) >= payload.num_questions:
        result = []
        for q in db_quizzes:
            try:
                opts = json.loads(q.options)
            except Exception:
                opts = [q.options]
            result.append(QuizQuestionOut(
                id=q.id,
                question=q.question,
                options=opts,
                answer=q.answer,
                explanation=q.explanation,
                difficulty=q.difficulty,
                question_type=q.question_type
            ))
        return result

    # Dynamic generation via AI service
    ai_questions = ai_service.generate_quiz(
        subject=payload.subject,
        topic=payload.topic or "General",
        num_questions=payload.num_questions,
        difficulty=payload.difficulty,
        question_type=payload.question_type
    )

    result = []
    for idx, item in enumerate(ai_questions):
        # Save to DB for caching
        opts_str = json.dumps(item.get("options", []))
        db_quiz = Quiz(
            subject_name=payload.subject,
            question=item["question"],
            options=opts_str,
            answer=item["answer"],
            explanation=item["explanation"],
            difficulty=item.get("difficulty", payload.difficulty),
            question_type=item.get("question_type", payload.question_type)
        )
        db.add(db_quiz)
        db.commit()
        db.refresh(db_quiz)

        result.append(QuizQuestionOut(
            id=db_quiz.id,
            question=db_quiz.question,
            options=item.get("options", []),
            answer=db_quiz.answer,
            explanation=db_quiz.explanation,
            difficulty=db_quiz.difficulty,
            question_type=db_quiz.question_type
        ))

    return result

@router.post("/submit", response_model=QuizSubmitResult)
def submit_quiz(
    payload: QuizSubmitRequest,
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total = len(payload.answers)
    if total == 0:
        raise HTTPException(status_code=400, detail="No answers submitted")

    correct_count = 0
    details = []

    for item in payload.answers:
        qid = item.get("question_id")
        user_ans = str(item.get("user_answer", "")).strip()
        
        quiz_q = db.query(Quiz).filter(Quiz.id == qid).first() if qid else None
        
        if quiz_q:
            correct_ans = quiz_q.answer.strip()
            is_correct = (user_ans == correct_ans) or (user_ans in correct_ans)
            if is_correct:
                correct_count += 1
            details.append({
                "question": quiz_q.question,
                "user_answer": user_ans,
                "correct_answer": correct_ans,
                "is_correct": is_correct,
                "explanation": quiz_q.explanation
            })
        else:
            # Fallback evaluation for dynamically generated client-side quizzes
            is_correct = bool(user_ans)
            if is_correct:
                correct_count += 1
            details.append({
                "question": item.get("question", "Quiz Question"),
                "user_answer": user_ans,
                "correct_answer": item.get("correct_answer", user_ans),
                "is_correct": is_correct,
                "explanation": "Evaluated response."
            })

    percentage = round((correct_count / total) * 100, 2)
    feedback = (
        "🌟 Excellent work! You have mastered this concept!" if percentage >= 80 else
        "👍 Good attempt! Review the weak topics and try again to hit 80%+." if percentage >= 50 else
        "💡 Don't worry! Re-read the lesson and use AI Tutor Chat to clarify your doubts."
    )

    # Save progress record
    prog = Progress(
        student_id=current_user.id,
        subject_name=payload.subject,
        score=percentage,
        completed=True if percentage >= 70 else False,
        time_spent_seconds=payload.total_time_seconds
    )
    db.add(prog)

    # Increase student streak
    current_user.streak_days = max(1, current_user.streak_days + 1)
    db.commit()

    return QuizSubmitResult(
        total_questions=total,
        correct_count=correct_count,
        score_percentage=percentage,
        feedback=feedback,
        details=details
    )
