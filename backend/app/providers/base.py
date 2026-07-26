from abc import ABC, abstractmethod


class JobProvider(ABC):
    """
    Base class for every job provider.
    """

    @abstractmethod
    async def fetch_jobs(
        self,
        keyword: str = "",
        location: str = ""
    ):
        """
        Fetch jobs from the provider.

        Every provider MUST return a list of jobs.

        Example:
        [
            {
                "company": "...",
                "title": "...",
                "location": "...",
                ...
            }
        ]
        """
        pass