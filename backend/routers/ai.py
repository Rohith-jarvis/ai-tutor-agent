from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import Student, ChatHistory, Note
from schemas import (
    AIChatRequest, AIChatResponse,
    AISummarizeRequest, AIExplainRequest,
    AINotesRequest, AIDoubtRequest
)
from auth import get_current_user
from services.ai_service import ai_service
import json

router = APIRouter(prefix="/ai", tags=["AI Tutor"])

@router.post("/chat", response_model=AIChatResponse)
def tutor_chat(
    payload: AIChatRequest,
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = ai_service.chat_tutor(
        message=payload.message,
        subject=payload.subject or "General",
        level=payload.level or "Intermediate"
    )

    # Save to chat history
    history = ChatHistory(
        student_id=current_user.id,
        message=payload.message,
        response=result["reply"],
        level=payload.level or "Intermediate",
        subject=payload.subject or "General"
    )
    db.add(history)
    db.commit()

    return AIChatResponse(
        reply=result["reply"],
        code_snippet=result.get("code_snippet"),
        diagram=result.get("diagram"),
        timestamp=datetime.utcnow()
    )

@router.post("/summarize")
def summarize_text(
    payload: AISummarizeRequest,
    current_user: Student = Depends(get_current_user)
):
    words = len(payload.text.split())
    summary = (
        f"### Text Summary ({words} words)\n\n"
        f"**Core Message**: {payload.text[:300]}...\n\n"
        f"**Key Takeaways**:\n"
        f"1. Summarized key logic and syntax structures.\n"
        f"2. Highlights essential functions, loop conditions, and data variables.\n"
        f"3. Essential reading for topic revision before tests."
    )
    return {"summary": summary, "word_count": words}

@router.post("/explain")
def explain_code_or_concept(
    payload: AIExplainRequest,
    current_user: Student = Depends(get_current_user)
):
    explanation = ai_service.chat_tutor(
        message=f"Explain {payload.concept} in detail with line-by-line breakdown and practical code.",
        subject=payload.subject,
        level=payload.level
    )
    return {"explanation": explanation["reply"]}

@router.post("/notes")
def generate_notes(
    payload: AINotesRequest,
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = ai_service.generate_notes(
        topic=payload.topic,
        subject=payload.subject,
        detail_level=payload.detail_level
    )

    # Save generated note to DB
    note = Note(
        student_id=current_user.id,
        title=f"{payload.subject}: {payload.topic}",
        topic=payload.topic,
        content=res["notes_markdown"],
        flashcards=json.dumps(res.get("flashcards", []))
    )
    db.add(note)
    db.commit()

    return res

@router.post("/doubt")
def solve_doubt(
    payload: AIDoubtRequest,
    current_user: Student = Depends(get_current_user)
):
    res = ai_service.solve_doubt(
        question=payload.question,
        subject=payload.subject
    )
    return res

@router.get("/notes-list")
def get_user_notes(
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notes = db.query(Note).filter(Note.student_id == current_user.id).order_by(Note.created_at.desc()).all()
    out = []
    for n in notes:
        try:
            fc = json.loads(n.flashcards) if n.flashcards else []
        except Exception:
            fc = []
        out.append({
            "id": n.id,
            "title": n.title,
            "topic": n.topic,
            "content": n.content,
            "flashcards": fc,
            "created_at": n.created_at
        })
    return out
