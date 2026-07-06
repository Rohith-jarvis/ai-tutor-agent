# System Architecture - AI Personal Tutor Agent

## Overview

The **AI Personal Tutor Agent** is a full-stack, decoupled Web application consisting of:
1. **Frontend**: Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS + Framer Motion.
2. **Backend**: FastAPI (Python 3.11) REST API + SQLAlchemy ORM + SQLite/PostgreSQL.
3. **AI Engine**: OpenAI API / LangChain with prompt engineering & mock fallbacks.

## Component Diagram

```mermaid
graph TD
    User([Student User]) <--> NextFS[Next.js Frontend - App Router]
    NextFS <-->|JSON / Axios + JWT| FastAPI[FastAPI Backend Server]
    FastAPI <-->|SQLAlchemy ORM| DB[(SQLite / PostgreSQL Database)]
    FastAPI <-->|OpenAI SDK / LangChain| AI[OpenAI GPT Models / PDF Extractor]
```

## Database Schema

```mermaid
erDiagram
    STUDENTS ||--o{ PROGRESSES : tracks
    STUDENTS ||--o{ STUDY_PLANS : sets
    STUDENTS ||--o{ CHAT_HISTORIES : logs
    STUDENTS ||--o{ NOTES : generates
    SUBJECTS ||--o{ LESSONS : contains
    LESSONS ||--o{ QUIZZES : measures
    LESSONS ||--o{ PROGRESSES : evaluates
```
