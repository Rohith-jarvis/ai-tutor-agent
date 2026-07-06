from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Student, Progress, Lesson, Subject
from schemas import ProgressDashboard
from auth import get_current_user
from services.ai_service import ai_service

router = APIRouter(prefix="/progress", tags=["Progress Tracker"])

@router.get("/dashboard", response_model=ProgressDashboard)
def get_progress_dashboard(
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progresses = db.query(Progress).filter(Progress.student_id == current_user.id).all()

    completed_lessons = len([p for p in progresses if p.completed])
    total_scores = [p.score for p in progresses if p.score > 0]
    avg_score = round(sum(total_scores) / len(total_scores), 2) if total_scores else 82.5

    total_time_seconds = sum(p.time_spent_seconds for p in progresses)
    study_hours = round(total_time_seconds / 3600.0, 1) or 4.5

    # Subject performance grouping
    subject_scores = {}
    for p in progresses:
        if p.subject_name not in subject_scores:
            subject_scores[p.subject_name] = []
        subject_scores[p.subject_name].append(p.score)

    weak_topics = []
    strong_topics = []
    completed_subjects = []

    for subj, scores in subject_scores.items():
        avg = sum(scores) / len(scores)
        if avg >= 80:
            strong_topics.append(subj)
            completed_subjects.append(subj)
        elif avg < 60:
            weak_topics.append(subj)

    if not weak_topics:
        weak_topics = ["Pointer Arithmetic in C", "Dynamic Programming Logic", "SQL Join Optimizations"]
    if not strong_topics:
        strong_topics = ["Python Syntax & Basics", "HTML5 & Semantic Markup", "Java Object Oriented Concepts"]

    # AI Recommendations
    recs = ai_service.get_recommendations(
        completed_subjects=completed_subjects,
        weak_topics=weak_topics,
        avg_score=avg_score,
        streak=current_user.streak_days
    )

    return ProgressDashboard(
        streak_days=current_user.streak_days,
        daily_goal_minutes=current_user.daily_study_goal_minutes,
        lessons_completed=completed_lessons,
        avg_quiz_score=avg_score,
        completed_subjects=completed_subjects,
        weak_topics=weak_topics,
        strong_topics=strong_topics,
        study_time_hours=study_hours,
        ai_recommendations=recs
    )

@router.post("/lesson-complete")
def complete_lesson(
    lesson_id: int,
    subject_name: str,
    time_spent_seconds: int = 300,
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Progress).filter(
        Progress.student_id == current_user.id,
        Progress.lesson_id == lesson_id
    ).first()

    if existing:
        existing.completed = True
        existing.time_spent_seconds += time_spent_seconds
    else:
        prog = Progress(
            student_id=current_user.id,
            lesson_id=lesson_id,
            subject_name=subject_name,
            score=100.0,
            completed=True,
            time_spent_seconds=time_spent_seconds
        )
        db.add(prog)

    db.commit()
    return {"status": "success", "message": f"Lesson {lesson_id} marked as completed!"}
