from fastapi import APIRouter, UploadFile, File

from app.services.resume_parser import extract_text_from_pdf
from app.services.resume_analyzer import analyze_resume
from app.services.job_collector import JobCollector
from app.services.job_ranker import JobRanker
from app.services.ai_resume_analyzer import ai_resume_analysis
from app.services.ats_scorer import score_resume

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.post("/recommend")
async def recommend_jobs(
    resume: UploadFile = File(...)
):

    # -------------------------------------------------
    # Step 1: Extract Resume Text
    # -------------------------------------------------

    text, pages = extract_text_from_pdf(resume)

    # -------------------------------------------------
    # Step 2: Parse Resume
    # -------------------------------------------------

    analysis = analyze_resume(text)

    # -------------------------------------------------
    # Step 3: ATS Score
    # -------------------------------------------------

    ats_result = score_resume(analysis)

    # -------------------------------------------------
    # Step 4: Gemini Resume Analysis
    # -------------------------------------------------

    ai_result = ai_resume_analysis(analysis)

    # -------------------------------------------------
    # Step 5: Collect Jobs
    # -------------------------------------------------

    collector = JobCollector()

    filtered_jobs = await collector.collect_jobs(
        skills=analysis["skills"]
    )

    # -------------------------------------------------
    # Step 6: Rank Jobs
    # -------------------------------------------------

    ranker = JobRanker()

    ai_recommendations = ranker.rank_jobs(
        analysis,
        filtered_jobs
    )

    recommended_jobs = []

    for ai_job in ai_recommendations:

        index = ai_job.get("index")

        if index is None:
            continue

        if index >= len(filtered_jobs):
            continue

        original_job = filtered_jobs[index]

        recommended_jobs.append({
            **original_job,
            **ai_job
        })

    recommended_jobs.sort(
        key=lambda job: job.get("match_score", 0),
        reverse=True
    )

    # -------------------------------------------------
    # Response
    # -------------------------------------------------

    return {

        "success": True,

        "resume": {

            "filename": resume.filename,

            "skills": analysis.get("skills", []),

            "filtered_jobs": len(filtered_jobs),

            # ATS
            "ats_score": ats_result.get("ats_score"),

            "ats_strengths": ats_result.get("strengths"),

            "ats_missing_skills": ats_result.get("missing_skills"),

            # Gemini AI
            "summary": ai_result.get("summary"),

            "strengths": ai_result.get("strengths"),

            "weaknesses": ai_result.get("weaknesses"),

            "missing_keywords": ai_result.get("missing_keywords"),

            "best_matching_roles": ai_result.get("best_matching_roles"),

            "recommendations": ai_result.get("recommendations"),
        },

        "jobs": recommended_jobs
    }