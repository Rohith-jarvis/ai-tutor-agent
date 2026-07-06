from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    streak_days = Column(Integer, default=1)
    daily_study_goal_minutes = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    progresses = relationship("Progress", back_populates="student", cascade="all, delete-orphan")
    study_plans = relationship("StudyPlan", back_populates="student", cascade="all, delete-orphan")
    chat_histories = relationship("ChatHistory", back_populates="student", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="student", cascade="all, delete-orphan")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=False)
    icon = Column(String(50), default="BookOpen")
    category = Column(String(50), default="Programming")
    created_at = Column(DateTime, default=datetime.utcnow)

    lessons = relationship("Lesson", back_populates="subject_rel", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    title = Column(String(150), nullable=False)
    chapter = Column(String(100), default="Chapter 1")
    content = Column(Text, nullable=False)
    examples = Column(Text, nullable=True)
    exercises = Column(Text, nullable=True)
    order = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    subject_rel = relationship("Subject", back_populates="lessons")
    quizzes = relationship("Quiz", back_populates="lesson_rel", cascade="all, delete-orphan")
    progresses = relationship("Progress", back_populates="lesson_rel", cascade="all, delete-orphan")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    subject_name = Column(String(100), nullable=False)
    question = Column(Text, nullable=False)
    options = Column(Text, nullable=False)  # JSON string of options array
    answer = Column(String(255), nullable=False)
    explanation = Column(Text, nullable=False)
    question_type = Column(String(50), default="MCQ")  # MCQ, TrueFalse, FillBlank, Coding
    difficulty = Column(String(20), default="Medium")  # Easy, Medium, Hard
    created_at = Column(DateTime, default=datetime.utcnow)

    lesson_rel = relationship("Lesson", back_populates="quizzes")

class Progress(Base):
    __tablename__ = "progresses"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    subject_name = Column(String(100), nullable=False)
    score = Column(Float, default=0.0)
    completed = Column(Boolean, default=False)
    time_spent_seconds = Column(Integer, default=0)
    last_accessed = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="progresses")
    lesson_rel = relationship("Lesson", back_populates="progresses")

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    goal = Column(String(255), nullable=False)
    deadline = Column(DateTime, nullable=False)
    status = Column(String(20), default="Pending")  # Pending, In Progress, Completed
    target_type = Column(String(20), default="Daily")  # Daily, Weekly, Monthly
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="study_plans")

class ChatHistory(Base):
    __tablename__ = "chat_histories"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    level = Column(String(20), default="Intermediate")
    subject = Column(String(100), default="General")
    timestamp = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="chat_histories")

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    title = Column(String(150), nullable=False)
    topic = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    flashcards = Column(Text, nullable=True) # JSON array string
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="notes")

class CodingProblem(Base):
    __tablename__ = "coding_problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    language = Column(String(20), nullable=False) # Java, Python, C
    difficulty = Column(String(20), default="Easy") # Easy, Medium, Hard
    problem_statement = Column(Text, nullable=False)
    sample_input = Column(Text, nullable=False)
    sample_output = Column(Text, nullable=False)
    hints = Column(Text, nullable=False)
    solution_code = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
