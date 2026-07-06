# REST API Specification - AI Personal Tutor Agent

Base API URL: `http://localhost:8000/api`

## 1. Authentication Endpoints
- `POST /auth/register`: Create student account & return JWT token.
- `POST /auth/login`: Authenticate email & password.
- `GET /auth/profile`: Get current student profile.
- `PUT /auth/profile`: Update profile name & daily goal.

## 2. Subjects & Lessons
- `GET /subjects`: List all 13 curriculum subjects.
- `GET /subjects/{id}`: Subject detail & list of lessons.
- `GET /lessons/{id}`: Lesson content view.

## 3. Quiz Generator
- `POST /quizzes/generate`: Generate MCQs, True/False, Fill in blanks, or Coding questions.
- `POST /quizzes/submit`: Submit user answers, evaluate score %, update streak & progress.

## 4. AI Tutor Engine
- `POST /ai/chat`: Multi-turn AI tutor chat with level selection (Beginner, Intermediate, Advanced).
- `POST /ai/summarize`: Text summarization.
- `POST /ai/explain`: Line-by-line code breakdown & concept explainer.
- `POST /ai/notes`: Generate structured notes & flashcards.
- `POST /ai/doubt`: Instant doubt solver.

## 5. Coding Practice
- `POST /coding/run`: Execute student code submission against test cases.
- `GET /coding/problems`: List coding problems.

## 6. Progress & Planner
- `GET /progress/dashboard`: Student metrics, streak, weak/strong topics, AI recommendations.
- `POST /progress/lesson-complete`: Mark lesson complete.
- `GET /goals` & `POST /goals`: Manage study targets.

## 7. PDF Learning
- `POST /pdf/upload`: Upload PDF/TXT file for text extraction & AI analysis.
