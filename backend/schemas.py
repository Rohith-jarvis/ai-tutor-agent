from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class StudentRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class StudentLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "StudentOut"

class StudentOut(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool
    streak_days: int
    daily_study_goal_minutes: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    daily_study_goal_minutes: Optional[int] = None

# Subject & Lesson Schemas
class LessonOut(BaseModel):
    id: int
    subject_id: int
    title: str
    chapter: str
    content: str
    examples: Optional[str] = None
    exercises: Optional[str] = None
    order: int

    class Config:
        from_attributes = True

class SubjectOut(BaseModel):
    id: int
    title: str
    description: str
    icon: str
    category: str
    lessons: List[LessonOut] = []

    class Config:
        from_attributes = True

class LessonCreate(BaseModel):
    subject_id: int
    title: str
    chapter: str
    content: str
    examples: Optional[str] = None
    exercises: Optional[str] = None
    order: int = 1

class SubjectCreate(BaseModel):
    title: str
    description: str
    icon: str = "BookOpen"
    category: str = "Programming"

# Quiz Schemas
class QuizGenerateRequest(BaseModel):
    subject: str
    topic: Optional[str] = "General"
    num_questions: int = 5
    difficulty: str = "Medium"  # Easy, Medium, Hard
    question_type: str = "MCQ"   # MCQ, TrueFalse, FillBlank, Coding

class QuizQuestionOut(BaseModel):
    id: Optional[int] = None
    question: str
    options: List[str]
    answer: str
    explanation: str
    difficulty: str
    question_type: str

class QuizSubmitRequest(BaseModel):
    subject: str
    answers: List[dict] # [{"question_id": 1, "user_answer": "A"}]
    total_time_seconds: int = 0

class QuizSubmitResult(BaseModel):
    total_questions: int
    correct_count: int
    score_percentage: float
    feedback: str
    details: List[dict]

# AI Schemas
class AIChatRequest(BaseModel):
    message: str
    subject: Optional[str] = "General"
    level: Optional[str] = "Intermediate"  # Beginner, Intermediate, Advanced
    session_id: Optional[str] = None

class AIChatResponse(BaseModel):
    reply: str
    code_snippet: Optional[str] = None
    diagram: Optional[str] = None
    timestamp: datetime

class AISummarizeRequest(BaseModel):
    text: str
    length: Optional[str] = "medium" # short, medium, detailed

class AIExplainRequest(BaseModel):
    concept: str
    subject: str
    level: str = "Beginner"

class AINotesRequest(BaseModel):
    topic: str
    subject: str
    detail_level: str = "Standard"

class AIDoubtRequest(BaseModel):
    question: str
    subject: str

# Progress & Study Plan Schemas
class ProgressOut(BaseModel):
    id: int
    subject_name: str
    score: float
    completed: bool
    time_spent_seconds: int
    last_accessed: datetime

    class Config:
        from_attributes = True

class ProgressDashboard(BaseModel):
    streak_days: int
    daily_goal_minutes: int
    lessons_completed: int
    avg_quiz_score: float
    completed_subjects: List[str]
    weak_topics: List[str]
    strong_topics: List[str]
    study_time_hours: float
    ai_recommendations: List[str]

class GoalCreate(BaseModel):
    goal: str
    deadline: str  # YYYY-MM-DD
    target_type: str = "Daily" # Daily, Weekly, Monthly

class GoalOut(BaseModel):
    id: int
    goal: str
    deadline: datetime
    status: str
    target_type: str

    class Config:
        from_attributes = True

# Coding Arena Schemas
class CodingProblemOut(BaseModel):
    id: int
    title: str
    language: str
    difficulty: str
    problem_statement: str
    sample_input: str
    sample_output: str
    hints: str
    explanation: str

    class Config:
        from_attributes = True

class CodeRunRequest(BaseModel):
    problem_id: int
    language: str
    code: str

class CodeRunResponse(BaseModel):
    passed: bool
    output: str
    expected_output: str
    error: Optional[str] = None
    feedback: str

# PDF Processing Schemas
class PDFSummarizeResponse(BaseModel):
    summary: str
    key_concepts: List[str]
    generated_questions: List[str]

# Circular import fix
Token.model_rebuild()
