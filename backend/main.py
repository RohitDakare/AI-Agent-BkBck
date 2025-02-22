from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
import aioredis
import asyncio
import json
import os
from utils.scraper import CollegeScraper

# Add these imports
from functools import lru_cache
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()
scraper = CollegeScraper()
executor = ThreadPoolExecutor(max_workers=4)  # For parallel processing

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Redis connection pool
redis = None

@app.on_event("startup")
async def startup_event():
    global redis
    redis = await aioredis.from_url(
        os.getenv('REDIS_URL', 'redis://localhost:6379'),
        encoding="utf-8",
        decode_responses=True
    )

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

@lru_cache(maxsize=1000)
def process_query(query: str) -> str:
    # Get information from the scraper
    college_info = scraper.get_college_info()
    
    if not college_info:
        return "I apologize, but I'm having trouble accessing the college information. Please try again later."

    # Optimized keyword matching using sets
    query_words = set(query.lower().split())
    
    about_keywords = {'about', 'college', 'institution', 'address', 'location'}
    if query_words & about_keywords:
        return college_info['about']
    
    course_keywords = {'course', 'program', 'degree', 'study', 'education'}
    if query_words & course_keywords:
        return "Available courses: " + ", ".join(college_info['courses'])
    
    admission_keywords = {'admission', 'apply', 'enroll', 'join', 'register'}
    if query_words & admission_keywords:
        admissions = college_info['admissions']
        return f"Admission Process: {admissions['process']}\nRequirements: {admissions['requirements']}\nDeadlines: {admissions['deadlines']}"
    
    facility_keywords = {'facility', 'infrastructure', 'amenity', 'campus'}
    if query_words & facility_keywords:
        return "College facilities include: " + ", ".join(college_info['facilities'])

    return "I apologize, but I couldn't find specific information about that. Please try asking about our courses, admissions, facilities, or general information about the college."

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        # Process query in thread pool for non-blocking operation
        response = await asyncio.get_event_loop().run_in_executor(
            executor, 
            process_query, 
            message.message
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
