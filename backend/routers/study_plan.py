from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models import Student, StudyPlan
from schemas import GoalCreate, GoalOut
from auth import get_current_user

router = APIRouter(prefix="/goals", tags=["Study Planner"])

@router.get("", response_model=List[GoalOut])
def get_goals(
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goals = db.query(StudyPlan).filter(StudyPlan.student_id == current_user.id).order_by(StudyPlan.deadline.asc()).all()
    return goals

@router.post("", response_model=GoalOut, status_code=status.HTTP_201_CREATED)
def create_goal(
    payload: GoalCreate,
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        dt = datetime.strptime(payload.deadline, "%Y-%m-%d")
    except Exception:
        dt = datetime.utcnow()

    plan = StudyPlan(
        student_id=current_user.id,
        goal=payload.goal,
        deadline=dt,
        target_type=payload.target_type,
        status="Pending"
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan

@router.delete("/{goal_id}")
def delete_goal(
    goal_id: int,
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    plan = db.query(StudyPlan).filter(
        StudyPlan.id == goal_id,
        StudyPlan.student_id == current_user.id
    ).first()

    if not plan:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(plan)
    db.commit()
    return {"status": "success", "message": "Study goal deleted"}
