import re


class JobFilter:
    """
    Scores jobs based on resume skills and returns
    the best matching jobs first.
    """

    def filter_jobs(self, jobs, skills):

        if not skills:
            return jobs

        scored_jobs = []

        for job in jobs:

            score = 0

            title = job.get("title", "").lower()

            description = re.sub(
                "<.*?>",
                " ",
                job.get("description", "").lower()
            )

            matched_skills = []

            for skill in skills:

                skill = skill.lower()

                # Title match gets higher weight
                if skill in title:
                    score += 5
                    matched_skills.append(skill)

                # Description match gets lower weight
                elif skill in description:
                    score += 2
                    matched_skills.append(skill)

            if score > 0:

                job["match_score"] = score
                job["matched_skills"] = sorted(
                    list(set(matched_skills))
                )

                scored_jobs.append(job)

        scored_jobs.sort(
            key=lambda x: x["match_score"],
            reverse=True
        )

        return scored_jobs