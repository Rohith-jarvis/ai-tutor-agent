from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Student
from schemas import StudentRegister, StudentLogin, Token, StudentOut, ProfileUpdate
from auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_student(payload: StudentRegister, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student with this email already exists"
        )
    
    hashed_pwd = get_password_hash(payload.password)
    student = Student(
        name=payload.name,
        email=payload.email,
        hashed_password=hashed_pwd,
        is_admin=False
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    token = create_access_token({"sub": student.email})
    return {"access_token": token, "token_type": "bearer", "user": student}

@router.post("/login", response_model=Token)
def login_student(payload: StudentLogin, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == payload.email).first()
    if not student or not verify_password(payload.password, student.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = create_access_token({"sub": student.email})
    return {"access_token": token, "token_type": "bearer", "user": student}

@router.get("/profile", response_model=StudentOut)
def get_profile(current_user: Student = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=StudentOut)
def update_profile(
    payload: ProfileUpdate,
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.name is not None:
        current_user.name = payload.name
    if payload.daily_study_goal_minutes is not None:
        current_user.daily_study_goal_minutes = payload.daily_study_goal_minutes
        
    db.commit()
    db.refresh(current_user)
    return current_user
