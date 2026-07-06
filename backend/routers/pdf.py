from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from schemas import PDFSummarizeResponse
from auth import get_current_user
from models import Student
from services.pdf_service import pdf_service

router = APIRouter(prefix="/pdf", tags=["PDF Learning"])

@router.post("/upload", response_model=PDFSummarizeResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: Student = Depends(get_current_user)
):
    if not file.filename.endswith((".pdf", ".txt")):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported")

    content_bytes = await file.read()
    extracted_text = pdf_service.extract_text_from_bytes(content_bytes)

    res = pdf_service.process_and_summarize(extracted_text)
    return res

@router.post("/summarize-pdf", response_model=PDFSummarizeResponse)
def summarize_pdf_text(
    text: str = Form(...),
    current_user: Student = Depends(get_current_user)
):
    res = pdf_service.process_and_summarize(text)
    return res
