from app.providers.google import GoogleProvider
from app.providers.microsoft import MicrosoftProvider
from app.providers.greenhouse import GreenhouseProvider
from app.services.job_filter import JobFilter


class JobCollector:

    def __init__(self):

        self.providers = [
            GoogleProvider(),
            MicrosoftProvider(),
            GreenhouseProvider(),
        ]

        self.job_filter = JobFilter()

    async def collect_jobs(self, skills=None):

        all_jobs = []

        for provider in self.providers:

            jobs = await provider.fetch_jobs()

            all_jobs.extend(jobs)

        print(f"Collected {len(all_jobs)} jobs")

        # Filter jobs if skills are provided
        if skills:
            filtered_jobs = self.job_filter.filter_jobs(
                all_jobs,
                skills
            )

            print(f"Filtered down to {len(filtered_jobs)} jobs")

            return filtered_jobs

        return all_jobs