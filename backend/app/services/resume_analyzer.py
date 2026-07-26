import re

SKILLS = [
    "Python",
    "Java",
    "C++",
    "SQL",
    "FastAPI",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Docker",
    "Git",
    "Linux",
    "PostgreSQL",
    "MongoDB",
    "React",
    "Node.js",
    "Next.js",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "XGBoost",
    "GraphQL",
    "Prisma",
    "Supabase",
    "Chroma",
    "BERT",
    "NLP",
    "REST API",
    "AWS",
    "Kubernetes",
    "CI/CD"
]


def extract_links(text):
    github = None
    linkedin = None

    github_match = re.search(
        r"(https?://)?(www\.)?github\.com/[A-Za-z0-9_.-]+",
        text,
        re.IGNORECASE,
    )

    linkedin_match = re.search(
        r"(https?://)?(www\.)?linkedin\.com/in/[A-Za-z0-9_-]+",
        text,
        re.IGNORECASE,
    )

    if github_match:
        github = github_match.group()

    if linkedin_match:
        linkedin = linkedin_match.group()

    return github, linkedin


def analyze_resume(text: str):

    email = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    phone = re.search(
        r"(\+?\d[\d\s-]{8,}\d)",
        text
    )

    lines = [line.strip() for line in text.splitlines() if line.strip()]

    name = lines[0] if lines else ""

    lower_text = text.lower()

    found_skills = sorted(
        [
            skill
            for skill in SKILLS
            if skill.lower() in lower_text
        ]
    )

    github, linkedin = extract_links(text)

    education = bool(
        re.search(
            r"(Bachelor|Master|B\.Tech|M\.Tech|University|College|CGPA|Degree)",
            text,
            re.IGNORECASE,
        )
    )

    experience = bool(
        re.search(
            r"(Experience|Intern|Internship|Software Engineer|Developer|Analyst|Company)",
            text,
            re.IGNORECASE,
        )
    )

    projects = bool(
        re.search(
            r"(Projects|Project)",
            text,
            re.IGNORECASE,
        )
    )

    achievements = bool(
        re.search(
            r"(Achievement|Award|Hackathon|Winner|Finalist|Top|Selected)",
            text,
            re.IGNORECASE,
        )
    )

    certifications = bool(
        re.search(
            r"(Certification|Certified|Coursera|Udemy|AWS|Google Cloud|Microsoft)",
            text,
            re.IGNORECASE,
        )
    )

    return {
        "name": name,
        "email": email.group() if email else None,
        "phone": phone.group() if phone else None,
        "github": github,
        "linkedin": linkedin,
        "skills": found_skills,
        "education_present": education,
        "experience_present": experience,
        "projects_present": projects,
        "achievements_present": achievements,
        "certifications_present": certifications,
        "skill_count": len(found_skills)
    }