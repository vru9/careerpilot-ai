from app.providers.base import JobProvider


class MicrosoftProvider(JobProvider):

    async def fetch_jobs(
        self,
        keyword: str = "",
        location: str = ""
    ):
        return []