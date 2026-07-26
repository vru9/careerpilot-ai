from sqlalchemy.orm import Session

from app.database.models import Resume


def save_resume(
    db: Session,
    clerk_user_id: str,
    filename: str,
    resume_text: str,
    ats_score: float,
    ai_analysis: dict,
):
    resume = Resume(
        clerk_user_id=clerk_user_id,
        resume_name=filename,
        resume_text=resume_text,
        ats_score=ats_score,
        summary=ai_analysis.get("summary", ""),
        strengths=ai_analysis.get("strengths", []),
        weaknesses=ai_analysis.get("weaknesses", []),
        skills=ai_analysis.get("skills", []),
        recommendations=ai_analysis.get("recommendations", []),
        best_matching_roles=ai_analysis.get("best_matching_roles", []),
        missing_keywords=ai_analysis.get("missing_keywords", []),
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume