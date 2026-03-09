from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow React frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://college-9yqe.vercel.app/",
        "https://college-9yqe-git-main-anujsingh1729s-projects.vercel.app/",
        "https://college-9yqe-olz2aess6-anujsingh1729s-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class ChildProfile(BaseModel):
    name: str
    grade: int                        # 6 to 12
    interests: List[str]              # e.g. ["coding", "music", "sports"]
    dream_colleges: List[str]         # e.g. ["MIT", "Stanford"]
    career_goals: str                 # e.g. "I want to be a software engineer"

class Plan(BaseModel):
    activities: List[str]
    volunteering: List[str]
    summer_programs: List[str]
    skills_certifications: List[str]
    monthly_tracker: List[str]
    essay_topics: List[str]


# --- Helper: Build AI Prompt ---
def build_prompt(profile: ChildProfile) -> str:
    return f"""
You are a college admissions expert helping parents build a personalized 
college readiness plan for their child.

Child Profile:
- Name: {profile.name}
- Grade: {profile.grade}
- Interests: {", ".join(profile.interests)}
- Dream Colleges: {", ".join(profile.dream_colleges)}
- Career Goals: {profile.career_goals}

Generate a personalized college readiness plan with exactly these 6 sections.
Respond ONLY in valid JSON with these exact keys, no extra text:

{{
  "activities": ["5 specific club or activity recommendations"],
  "volunteering": ["5 specific volunteering opportunities"],
  "summer_programs": ["5 specific summer program suggestions"],
  "skills_certifications": ["5 specific skills or certifications to pursue"],
  "monthly_tracker": ["12 monthly goals from January to December"],
  "essay_topics": ["5 college essay topic ideas based on their profile"]
}}
"""


# --- Routes ---
@app.get("/")
def root():
    return {"message": "CollegeEdge API is running!"}


@app.post("/generate-plan", response_model=Plan)
def generate_plan(profile: ChildProfile):
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2000,
        messages=[
            {"role": "user", "content": build_prompt(profile)}
        ]
    )

    import json
    import re

    raw = message.content[0].text.strip()

    # Strip markdown code blocks if Claude wraps response in ```json ... ```
    raw = re.sub(r"```json|```", "", raw).strip()

    if not raw:
        raise ValueError("Empty response from Claude")

    parsed = json.loads(raw)
    return Plan(**parsed)
