from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.api.resume_routes import router as resume_router
from app.api.jobs_routes import router as jobs_router
from app.config.settings import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
)

# ----------------------------
# CORS Configuration
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://careerpilot-ai-lime-phi.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Register Routers
# ----------------------------
app.include_router(router)
app.include_router(resume_router)
app.include_router(jobs_router)


@app.get("/")
def root():
    return {
        "message": "CareerPilot Backend is Running 🚀"
    }