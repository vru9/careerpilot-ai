from app.providers.base import JobProvider


class GoogleProvider(JobProvider):

    async def fetch_jobs(
        self,
        keyword: str = "",
        location: str = ""
    ):
        return []