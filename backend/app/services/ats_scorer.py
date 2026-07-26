def score_resume(data):
    score = 50

    skills = data.get("skills", [])

    bonus = {
        "Python": 5,
        "SQL": 5,
        "FastAPI": 5,
        "Machine Learning": 8,
        "React": 4,
        "Node.js": 4,
        "Git": 3,
        "Linux": 3,
        "PostgreSQL": 4,
        "Docker": 6,
        "AWS": 8,
    }

    strengths = []
    missing = []

    for skill, pts in bonus.items():
        if skill in skills:
            score += pts
            strengths.append(skill)
        else:
            missing.append(skill)

    score = min(score, 100)

    return {
        "ats_score": score,
        "strengths": strengths,
        "missing_skills": missing,
    }