import json
from google import genai
from google.genai import types
from app.config.settings import settings

# Create Gemini client
client = genai.Client(api_key=settings.GEMINI_API_KEY)


def ai_resume_analysis(resume_data):

    prompt = f"""
You are an Expert ATS Resume Reviewer, Senior Technical Recruiter, and Career Coach.

You are reviewing a STUDENT resume.

The resume is already parsed into structured JSON.

Resume JSON:
{json.dumps(resume_data, indent=2)}

========================
Evaluation Guidelines
========================

Evaluate ONLY based on the supplied JSON.

Do NOT invent any information.

Education:
- If the education field contains data, NEVER say education is missing.

Projects:
- If projects exist, evaluate their quality instead of saying projects are missing.

Experience:
- Distinguish between:
    • Professional Work Experience
    • Internship
    • Academic Projects

If there is no internship or job experience, say:
"No formal industry experience yet."

DO NOT say:
"Experience missing."

Skills:
- Detect all technical skills present.
- Mention missing industry-standard skills only if relevant.

ATS Score:
Give a realistic ATS score (0–100) using these weights:

• Resume Structure .............20%
• Skills Match..................20%
• Projects......................20%
• Education.....................10%
• Experience / Internship.......15%
• ATS Formatting................10%
• Keywords.......................5%

Scoring Rules:
90–100 = Excellent
80–89 = Very Strong
70–79 = Good
60–69 = Average
Below 60 = Needs Improvement

Recommendations:
Give practical improvements.
Avoid generic advice.

Return ONLY valid JSON in exactly this format:

{{
  "ats_score": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "missing_keywords": [],
  "skills_detected": [],
  "best_matching_roles": [],
  "recommendations": []
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

        text = response.text.strip()

        if text.startswith("```"):
            text = (
                text.replace("```json", "")
                .replace("```", "")
                .strip()
            )

        return json.loads(text)

    except json.JSONDecodeError:
        return {
            "ats_score": 0,
            "summary": "Failed to parse AI response.",
            "strengths": [],
            "weaknesses": [],
            "missing_keywords": [],
            "skills_detected": [],
            "best_matching_roles": [],
            "recommendations": []
        }

    except Exception as e:
        return {
            "ats_score": 0,
            "summary": f"AI Analysis Failed: {str(e)}",
            "strengths": [],
            "weaknesses": [],
            "missing_keywords": [],
            "skills_detected": [],
            "best_matching_roles": [],
            "recommendations": []
        }