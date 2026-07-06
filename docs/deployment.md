# Production Deployment Guide

## 1. Backend Deployment (Render / Railway / Docker)

### Deploying to Render
1. Create a new **Web Service** on Render connected to your GitHub repository.
2. Set **Root Directory**: `backend`
3. Set **Runtime**: `Python 3`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `SECRET_KEY`: `your-production-jwt-secret`
   - `DATABASE_URL`: `sqlite:///./tutor_agent.db` (or PostgreSQL URL)
   - `OPENAI_API_KEY`: `your_openai_api_key`

## 2. Frontend Deployment (Vercel)

1. Import repository to Vercel dashboard.
2. Select **Framework Preset**: `Next.js`
3. Set **Root Directory**: `frontend`
4. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-render-app.onrender.com/api`
5. Click **Deploy**.

## 3. Docker Compose Local Running

```bash
docker-compose up --build
```
- Frontend will run at `http://localhost:3000`
- Backend API will run at `http://localhost:8000`
