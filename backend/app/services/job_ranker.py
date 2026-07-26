import json

from google import genai
from google.genai import types

from app.config.settings import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


class JobRanker:

    def rank_jobs(
        self,
        resume_analysis,
        jobs
    ):

        prompt = f"""
You are a Senior Technical Recruiter and AI Career Advisor.

You are given:

1. Resume skills.
2. A list of already filtered jobs.

IMPORTANT RULES

- Do NOT rewrite company name.
- Do NOT rewrite title.
- Do NOT rewrite location.
- Do NOT rewrite salary.
- Do NOT rewrite apply_url.
- Do NOT invent any factual information.

Your ONLY task is to analyse each job.

For each job return:

- index
- match_score (0-100)
- why_match
- strengths
- missing_skills
- learning_priority
- interview_readiness (High/Medium/Low)

Resume Skills:

{resume_analysis.get("skills", [])}

Jobs:

{json.dumps(jobs[:20], indent=2)}

Return ONLY valid JSON.

Format:

[
    {{
        "index":0,
        "match_score":95,
        "why_match":"",
        "strengths":[],
        "missing_skills":[],
        "learning_priority":[],
        "interview_readiness":"High"
    }}
]
"""

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",   # Use a model you have access to
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.2,
                    response_mime_type="application/json",
                ),
            )

            return json.loads(response.text)

        except Exception as e:
            print("=" * 80)
            print("Gemini Job Ranking Failed")
            print(e)
            print("=" * 80)

            # Fallback ranking
            fallback = []

            for index, job in enumerate(jobs[:20]):
                fallback.append({
                    "index": index,
                    "match_score": 70,
                    "why_match": "AI ranking unavailable. Using default ranking.",
                    "strengths": [],
                    "missing_skills": [],
                    "learning_priority": [],
                    "interview_readiness": "Medium"
                })

            return fallback