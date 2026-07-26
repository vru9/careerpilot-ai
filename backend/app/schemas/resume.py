from pydantic import BaseModel


class ResumeResponse(BaseModel):
    text: str