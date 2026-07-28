# 🚀 CareerPilot AI

> AI-powered career intelligence platform that analyses resumes, evaluates ATS compatibility, identifies skill gaps, discovers relevant job opportunities, and ranks them based on candidate-job fit.

CareerPilot AI helps students and early-career professionals move from **resume → analysis → job discovery → application** through one intelligent platform.

🌐 **Live Application:**  
https://careerpilot-ai-lime-phi.vercel.app

---

## ✨ Features

### 📄 AI Resume Analysis
Upload a resume and receive structured AI-powered feedback including:

- Resume strengths
- Resume weaknesses
- ATS score
- Skill identification
- Best matching career roles

### 🎯 Intelligent Job Matching

CareerPilot discovers job opportunities and evaluates them against the candidate's resume.

Each recommendation includes:

- Match Score
- Matched Skills
- Missing Skills
- Learning Priorities
- Interview Readiness
- Explanation of why the role matches
- Direct application link

### 🔍 Live Job Discovery

CareerPilot integrates with job providers to collect opportunities and filter them according to the candidate's profile.

### 🤖 AI-Powered Ranking

Rather than displaying jobs only through keyword matching, CareerPilot uses AI to analyse the relationship between:

- Candidate skills
- Resume experience
- Job requirements
- Missing competencies
- Career suitability

### 🔐 Authentication

Secure user authentication is integrated using Clerk.

### 📱 Responsive Dashboard

The CareerPilot dashboard is designed for both desktop and mobile devices and provides a single view of resume insights and job recommendations.

---

## 🧠 How CareerPilot Works

```text
                    ┌─────────────────┐
                    │     USER        │
                    └────────┬────────┘
                             │
                      Upload Resume
                             │
                             ▼
                    ┌─────────────────┐
                    │ Next.js Frontend│
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ FastAPI Backend │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       Resume Parser    ATS Analysis    AI Analysis
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    ┌─────────────────┐
                    │ Job Discovery   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ AI Job Ranking  │
                    └────────┬────────┘
                             │
                             ▼
              ┌─────────────────────────┐
              │ CareerPilot Dashboard   │
              │                         │
              │ • Match Score           │
              │ • Skill Gaps            │
              │ • Learning Priorities   │
              │ • Interview Readiness   │
              └─────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Clerk Authentication

### Backend

- Python
- FastAPI
- Uvicorn

### Artificial Intelligence

- Google Gemini
- AI-based resume analysis
- AI-based job ranking
- Skill-gap analysis

### Deployment

- Vercel — Frontend
- Render — Backend
- GitHub — Version Control

---

## 📂 Project Structure

```text
careerpilot-ai/
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   └── ...
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── config/
│   │   └── main.py
│   └── ...
│
├── docs/
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

## 🔄 CareerPilot Workflow

### 1. Upload Resume

The user uploads their resume through the CareerPilot interface.

### 2. Resume Processing

The backend extracts and processes resume content.

### 3. AI Resume Analysis

CareerPilot analyses the resume to determine strengths, weaknesses, skills and suitable career roles.

### 4. ATS Evaluation

The system generates an ATS score representing resume compatibility.

### 5. Job Discovery

CareerPilot collects relevant job opportunities from supported job sources.

### 6. AI Job Ranking

Jobs are ranked according to their compatibility with the candidate's resume.

### 7. Career Intelligence

The dashboard displays:

```text
Match Score
      ↓
Matched Skills
      ↓
Missing Skills
      ↓
Learning Priority
      ↓
Interview Readiness
      ↓
Apply
```

---

## 📸 Application Preview

### Career Intelligence Dashboard

Add your CareerPilot dashboard screenshot here.

```markdown
![CareerPilot Dashboard](docs/dashboard.png)
```

### Job Recommendation Engine

Add a screenshot showing the job recommendation cards.

```markdown
![CareerPilot Job Recommendations](docs/job-recommendations.png)
```

---

## 💻 Running CareerPilot Locally

### Clone the repository

```bash
git clone <your-repository-url>
cd careerpilot-ai
```

### Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

Create the required environment files locally.

Example:

```env
# Backend
GEMINI_API_KEY=your_api_key
```

```env
# Frontend
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
```

Never commit API keys or `.env` files to GitHub.

---

## 🚧 Future Improvements

CareerPilot can be extended with:

- Personalised career roadmaps
- AI interview preparation
- Resume improvement suggestions
- Application tracking
- Saved jobs
- Job alerts
- Advanced semantic job matching
- Candidate skill progression tracking
- Analytics for application success

---

## 🎯 Project Goal

CareerPilot AI aims to reduce the gap between **having skills** and **finding the right opportunity**.

Instead of requiring candidates to manually search hundreds of job listings, CareerPilot combines resume intelligence, skill-gap analysis and AI-powered job matching to help users understand:

> **Where do I currently fit, what am I missing, and what should I apply for?**

---

## 👩‍💻 Contributors

**Vruddhi Mule**

AI & Data Science | Machine Learning | Data Engineering | Software Development

**Rajdeep Pandey**

Software Development | Full-Stack Development

---

## 📄 License

This project is licensed under the MIT License.
