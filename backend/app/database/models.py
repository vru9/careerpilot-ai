from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    JSON,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base



class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    clerk_user_id = Column(String, nullable=False, index=True)

    resume_name = Column(String)

    resume_text = Column(Text)

    ats_score = Column(Float)

    summary = Column(Text)

    strengths = Column(JSON)

    weaknesses = Column(JSON)

    skills = Column(JSON)

    recommendations = Column(JSON)

    best_matching_roles = Column(JSON)

    missing_keywords = Column(JSON)

    created_at = Column(DateTime, default=datetime.utcnow)

    jobs = relationship(
        "JobRecommendation",
        back_populates="resume",
        cascade="all, delete-orphan",
    )


class JobRecommendation(Base):
    __tablename__ = "job_recommendations"

    id = Column(Integer, primary_key=True, index=True)

    resume_id = Column(Integer, ForeignKey("resumes.id"))

    title = Column(String)

    company = Column(String)

    location = Column(String)

    salary = Column(String)

    apply_url = Column(Text)

    match_score = Column(Float)

    why_match = Column(Text)

    matched_skills = Column(JSON)

    missing_skills = Column(JSON)

    learning_priority = Column(JSON)

    interview_readiness = Column(JSON)

    resume = relationship("Resume", back_populates="jobs")


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True)

    clerk_user_id = Column(String, nullable=False, index=True)

    title = Column(String)
    company = Column(String)
    apply_url = Column(Text)
    location = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)