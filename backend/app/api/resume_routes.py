from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.repositories.resume_repository import save_resume

from app.services.resume_parser import extract_text_from_pdf
from app.services.resume_analyzer import analyze_resume
from app.services.ats_scorer import score_resume
from app.services.resume_sections import extract_sections
from app.services.ai_resume_analyzer import ai_resume_analysis
from app.services.jd_matcher import match_resume_with_jd

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload")
async def upload_resume(
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Extract text from PDF
    text, pages = extract_text_from_pdf(resume)

    print("=" * 80)
    print("EXTRACTED RESUME TEXT")
    print("=" * 80)
    print(text)
    print("=" * 80)

    # Extract resume sections
    sections = extract_sections(text)

    print("=" * 80)
    print("EXTRACTED SECTIONS")
    print("=" * 80)
    print(sections)
    print("=" * 80)

    # Analyze resume
    analysis = analyze_resume(text)

    print("=" * 80)
    print("STRUCTURED ANALYSIS")
    print("=" * 80)
    print(analysis)
    print("=" * 80)

    # Data for Gemini
    ai_input = {
        "resume_analysis": analysis,
        "resume_sections": sections
    }

    print("=" * 80)
    print("DATA SENT TO GEMINI")
    print("=" * 80)
    print(ai_input)
    print("=" * 80)

    # AI Analysis
    ai_analysis = ai_resume_analysis(ai_input)

    # Rule-based ATS Score
    score = score_resume(analysis)

    rule_score = score["ats_score"]
    ai_score = ai_analysis.get("ats_score", 0)

    final_score = round(
        (rule_score * 0.4) +
        (ai_score * 0.6)
    )
    saved_resume = save_resume(
    db=db,
    clerk_user_id="test_user",   # Temporary
    filename=resume.filename,
    resume_text=text,
    ats_score=final_score,
    ai_analysis=ai_analysis,
)

    # ==========================
    # Save Resume to Database
    # ==========================
    saved_resume = save_resume(
        db=db,
        clerk_user_id="test_user",  # Temporary. Replace with Clerk ID later.
        filename=resume.filename,
        resume_text=text,
        ats_score=final_score,
        ai_analysis=ai_analysis,
    )

    return {
        "resume_id": saved_resume.id,

        "filename": resume.filename,
        "pages": pages,
        "characters": len(text),

        **analysis,

        "ats_score": final_score,
        "rule_based_score": rule_score,
        "ai_score": ai_score,

        "sections": sections,
        "ai_analysis": ai_analysis
    }


@router.post("/match")
async def match_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    # Extract resume text
    text, pages = extract_text_from_pdf(resume)

    # Extract sections
    sections = extract_sections(text)

    # Analyze resume
    analysis = analyze_resume(text)

    # Build structured JSON
    resume_json = {
        "resume_analysis": analysis,
        "resume_sections": sections
    }

    # Compare with Job Description
    result = match_resume_with_jd(
        resume_json,
        job_description
    )

    return {
        "filename": resume.filename,
        "pages": pages,
        **result
    }