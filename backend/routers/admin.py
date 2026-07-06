from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Student, Subject, Lesson, Quiz, Progress
from schemas import StudentOut, SubjectCreate, LessonCreate, SubjectOut, LessonOut
from auth import get_admin_user

router = APIRouter(prefix="/admin", tags=["Admin Panel"])

@router.get("/students", response_model=List[StudentOut])
def list_students(
    admin: Student = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    students = db.query(Student).all()
    return students

@router.post("/subjects", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
def create_subject(
    payload: SubjectCreate,
    admin: Student = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Subject).filter(Subject.title == payload.title).first()
    if existing:
        raise HTTPException(status_code=400, detail="Subject title already exists")

    subj = Subject(
        title=payload.title,
        description=payload.description,
        icon=payload.icon,
        category=payload.category
    )
    db.add(subj)
    db.commit()
    db.refresh(subj)
    return subj

@router.post("/lessons", response_model=LessonOut, status_code=status.HTTP_201_CREATED)
def create_lesson(
    payload: LessonCreate,
    admin: Student = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    subj = db.query(Subject).filter(Subject.id == payload.subject_id).first()
    if not subj:
        raise HTTPException(status_code=404, detail="Subject not found")

    lesson = Lesson(
        subject_id=payload.subject_id,
        title=payload.title,
        chapter=payload.chapter,
        content=payload.content,
        examples=payload.examples,
        exercises=payload.exercises,
        order=payload.order
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson

@router.delete("/lessons/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    admin: Student = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    db.delete(lesson)
    db.commit()
    return {"status": "success", "message": f"Lesson {lesson_id} deleted"}

@router.get("/analytics")
def get_admin_analytics(
    admin: Student = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    total_students = db.query(Student).count()
    total_subjects = db.query(Subject).count()
    total_lessons = db.query(Lesson).count()
    total_quizzes = db.query(Quiz).count()
    total_progresses = db.query(Progress).count()

    return {
        "total_students": total_students,
        "total_subjects": total_subjects,
        "total_lessons": total_lessons,
        "total_quizzes": total_quizzes,
        "total_progresses": total_progresses
    }
