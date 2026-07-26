import json
from google import genai
from google.genai import types

from app.config.settings import settings
from app.utils.skill_categories import SKILL_CATEGORIES

client = genai.Client(api_key=settings.GEMINI_API_KEY)


# =====================================================
# Match Level
# =====================================================

def get_match_level(score):
    if score >= 90:
        return "Outstanding Match"
    elif score >= 80:
        return "Excellent Match"
    elif score >= 70:
        return "Strong Match"
    elif score >= 60:
        return "Average Match"
    else:
        return "Weak Match"


# =====================================================
# Categorize Skills
# =====================================================

def categorize_skills(skills):
    categorized = {}

    for category, skill_list in SKILL_CATEGORIES.items():

        found = sorted({
            skill
            for skill in skills
            for known_skill in skill_list
            if skill.lower() == known_skill.lower()
        })

        if found:
            categorized[category] = {
                "count": len(found),
                "skills": found
            }

    return categorized


# =====================================================
# ATS Match Score Calculation
# =====================================================

def calculate_match_score(result, resume_data):

    matched = len(result.get("matched_skills", []))
    missing = len(result.get("missing_skills", []))

    total_skills = matched + missing

    keyword_match = round(
        (matched / total_skills) * 100
    ) if total_skills else 0

    analysis = resume_data["resume_analysis"]

    score = 0

    # -----------------------------------------
    # Skills (40 Marks)
    # -----------------------------------------
    score += keyword_match * 0.40

    # -----------------------------------------
    # Experience (20 Marks)
    # -----------------------------------------
    if analysis.get("experience_present"):
        score += 20

    # -----------------------------------------
    # Projects (15 Marks)
    # -----------------------------------------
    if analysis.get("projects_present"):
        score += 15

    # -----------------------------------------
    # Education (10 Marks)
    # -----------------------------------------
    if analysis.get("education_present"):
        score += 10

    # -----------------------------------------
    # Achievements (5 Marks)
    # -----------------------------------------
    if analysis.get("achievements_present"):
        score += 5

    # -----------------------------------------
    # Certifications (5 Marks)
    # -----------------------------------------
    if analysis.get("certifications_present"):
        score += 5

    # -----------------------------------------
    # GitHub + LinkedIn (5 Marks)
    # -----------------------------------------
    if analysis.get("github"):
        score += 2.5

    if analysis.get("linkedin"):
        score += 2.5

    return round(score), keyword_match


# =====================================================
# Resume vs Job Description Matching
# =====================================================

def match_resume_with_jd(resume_data, job_description):

    prompt = f"""
You are an Expert ATS System, Hiring Manager and Technical Recruiter.

Compare the resume with the given Job Description.

Resume JSON:

{json.dumps(resume_data, indent=2)}

Job Description:

{job_description}

Instructions:

1. Compare skills.
2. Compare projects.
3. Compare internship/work experience.
4. Compare education.
5. Compare technologies.
6. DO NOT calculate any scores.
7. DO NOT invent skills.
8. If a skill is not clearly mentioned, treat it as missing.
9. Recommendations should ONLY help improve the resume for THIS job.

Return ONLY valid JSON.

{{
    "matched_skills": [],
    "missing_skills": [],
    "strengths": [],
    "weaknesses": [],
    "recommendations": [],
    "interview_focus": [],
    "overall_verdict": ""
}}
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                response_mime_type="application/json",
            ),
        )

        result = json.loads(response.text)

        # -----------------------------------------
        # Categorize Skills
        # -----------------------------------------

        matched_skills = result.get("matched_skills", [])
        missing_skills = result.get("missing_skills", [])

        result["matched_skills_by_category"] = categorize_skills(
            matched_skills
        )

        result["missing_skills_by_category"] = categorize_skills(
            missing_skills
        )

        # -----------------------------------------
        # Calculate Scores
        # -----------------------------------------

        match_score, keyword_match = calculate_match_score(
            result,
            resume_data
        )

        result["match_score"] = match_score
        result["keyword_match"] = keyword_match
        result["match_level"] = get_match_level(match_score)

        return result

    except json.JSONDecodeError:

        return {
            "match_score": 0,
            "keyword_match": 0,
            "match_level": "Unknown",
            "matched_skills": [],
            "missing_skills": [],
            "matched_skills_by_category": {},
            "missing_skills_by_category": {},
            "strengths": [],
            "weaknesses": [],
            "recommendations": [],
            "interview_focus": [],
            "overall_verdict": "Failed to parse AI response."
        }

    except Exception as e:

        return {
            "match_score": 0,
            "keyword_match": 0,
            "match_level": "Unknown",
            "matched_skills": [],
            "missing_skills": [],
            "matched_skills_by_category": {},
            "missing_skills_by_category": {},
            "strengths": [],
            "weaknesses": [],
            "recommendations": [],
            "interview_focus": [],
            "overall_verdict": str(e)
        }