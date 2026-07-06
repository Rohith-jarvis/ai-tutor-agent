# AI Personal Tutor Agent 🚀

Production-ready, full-stack **AI Personal Tutor Agent** designed to help students master computer science, programming languages, and technical interview topics through personalized AI lessons, doubt solving, dynamic quiz generation, coding practice, PDF summarization, and progress analytics.

---

## 🌟 Key Features

1. **Student Authentication & Profile**: Secure JWT authentication, password hashing, and user profile management.
2. **Dashboard**: Live study streak tracking, daily goals, weak topic analysis, and AI-synthesized learning recommendations.
3. **13 Complete Subjects**: Pre-populated with chapters, detailed lessons, code examples, and practice exercises:
   - Java, Python, C Programming, Data Structures, HTML, CSS, JavaScript, SQL, DBMS, Operating System, Computer Networks, Aptitude, Interview Preparation.
4. **AI Tutor Studio**: Multi-turn conversation engine supporting Beginner, Intermediate, and Advanced explanation levels, line-by-line code explainer, and instant doubt solver.
5. **Smart Quiz Generator**: Generates MCQs, True/False, Fill in blanks, and Coding questions with countdown timer, immediate evaluation, and score feedback.
6. **Online Coding Arena**: Practice coding problems in Java, Python, and C with sample test cases, hints, and output validation.
7. **AI Study Planner**: Set daily, weekly, or monthly goals while AI generates customized study timetables.
8. **AI Notes & PDF Learning**: Upload study PDFs or raw notes. AI extracts summaries, key concepts, flashcards, and allows downloading PDF notes.
9. **Admin Panel**: Admin tools to manage students, create custom subjects/lessons, and view platform metrics.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Framer Motion, Recharts, jsPDF.
- **Backend**: Python 3.11, FastAPI, SQLAlchemy ORM, SQLite / PostgreSQL, PyPDF, Pytest.
- **AI**: OpenAI API / LangChain integration with offline fallback mode.
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt password hashing.

---

## 📁 Folder Structure

```
Tutor/
├── backend/
│   ├── main.py                   # FastAPI app entry & 13-subject database seeder
│   ├── config.py                 # App settings & env variables
│   ├── database.py               # SQLAlchemy engine & session dependency
│   ├── models.py                 # ORM Database models (Student, Subject, Lesson, Quiz, Progress, etc.)
│   ├── schemas.py                # Pydantic request & response models
│   ├── auth.py                   # JWT security & password hashing
│   ├── services/
│   │   ├── ai_service.py         # OpenAI API & offline fallback handler
│   │   ├── prompt_templates.py   # AI prompts for teaching, code explainer, quizzes
│   │   └── pdf_service.py        # PDF text extraction & document analyzer
│   ├── routers/                  # API routers (auth, subjects, quizzes, ai, coding, progress, etc.)
│   ├── tests/                    # Pytest test suite
│   ├── requirements.txt          # Python dependencies
│   └── Dockerfile                # Backend container config
│
├── frontend/
│   ├── app/                      # Next.js 15 App Router pages
│   ├── components/               # UI & Core application components (Navbar, Sidebar, QuizRunner, etc.)
│   ├── lib/                      # Axios API client, auth session helpers, utilities
│   ├── package.json              # Frontend dependencies
│   └── Dockerfile                # Frontend multi-stage container config
│
├── docs/                         # Architecture, API docs, deployment guides
├── docker-compose.yml            # Multi-container orchestration
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Run Backend (FastAPI)

```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload --port 8000
```
API docs will be available at `http://localhost:8000/docs`.

### 2. Run Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔑 Demo Login Credentials

- **Demo Student**: `demo@tutor.ai` / `password123`
- **Demo Admin**: `admin@tutor.ai` / `admin123`

---

## 🧪 Running Tests

```bash
cd backend
pytest tests/test_api.py -v
```
