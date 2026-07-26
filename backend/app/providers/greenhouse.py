import httpx

from app.providers.base import JobProvider


class GreenhouseProvider(JobProvider):

    BASE_URL = "https://boards-api.greenhouse.io/v1/boards"

    async def fetch_jobs(
        self,
        keyword: str = "",
        location: str = ""
    ):

        company = "stripe"

        url = f"{self.BASE_URL}/{company}/jobs?content=true"

        async with httpx.AsyncClient(timeout=30) as client:

            response = await client.get(url)

            if response.status_code != 200:
                print(f"Failed to fetch jobs from Greenhouse. Status Code: {response.status_code}")
                return []

            data = response.json()

        jobs = data.get("jobs", [])

        formatted_jobs = []

        for job in jobs:

            formatted_jobs.append(
                {
                    # Basic Information
                    "company": company.title(),
                    "title": job.get("title", ""),

                    # Salary (only if company provides it)
                    "salary": job.get("salary"),
                    "currency": job.get("currency"),

                    # Location
                    "location": job.get("location", {}).get("name", ""),

                    # Full Job Description
                    "description": job.get("content", ""),

                    # Additional Information
                    "employment_type": job.get("employment_type", ""),
                    "experience": job.get("experience", ""),

                    # Metadata
                    "posted_date": job.get("updated_at", ""),
                    "apply_url": job.get("absolute_url", ""),
                    "source": "Greenhouse",
                }
            )

        return formatted_jobs