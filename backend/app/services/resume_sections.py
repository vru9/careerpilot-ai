import re


def extract_sections(text: str):
    """
    Extract common resume sections using heading detection.
    Returns a dictionary where each key contains the text
    between its heading and the next detected heading.
    """

    headings = [
        "Professional Summary",
        "Summary",
        "Education",
        "Experience",
        "Work Experience",
        "Professional Experience",
        "Internship",
        "Projects",
        "Academic Projects",
        "Technical Skills",
        "Skills",
        "Certifications",
        "Achievements",
        "Awards",
        "Leadership",
        "Positions of Responsibility",
        "Volunteering",
        "Publications",
        "Languages"
    ]

    # Find all heading positions
    matches = []

    for heading in headings:
        pattern = rf"^\s*{re.escape(heading)}\s*$"
        for match in re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE):
            matches.append((match.start(), match.end(), heading.lower()))

    # Sort by occurrence in the resume
    matches.sort(key=lambda x: x[0])

    sections = {}

    for i, (_, end, heading) in enumerate(matches):

        start = end

        if i + 1 < len(matches):
            next_start = matches[i + 1][0]
        else:
            next_start = len(text)

        content = text[start:next_start].strip()

        key = (
            heading.replace(" ", "_")
                   .replace("professional_", "")
                   .replace("technical_", "")
                   .replace("work_", "")
                   .replace("academic_", "")
                   .replace("positions_of_responsibility", "leadership")
        )

        sections[key] = content

    # Ensure common keys always exist
    defaults = [
        "summary",
        "education",
        "experience",
        "internship",
        "projects",
        "skills",
        "certifications",
        "achievements",
        "leadership",
        "volunteering",
        "publications",
        "languages"
    ]

    for key in defaults:
        sections.setdefault(key, "")

    return sections