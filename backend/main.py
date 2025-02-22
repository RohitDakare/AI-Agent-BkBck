from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
import aioredis
import asyncio
import json
import os
from utils.scraper import CollegeScraper

app = FastAPI()
scraper = CollegeScraper()

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

async def get_college_info(query: str) -> str:
    # Get information from the scraper
    college_info = scraper.get_college_info()
    
    if not college_info:
        return "I apologize, but I'm having trouble accessing the college information. Please try again later."

    # Simple keyword matching
    query = query.lower()
    
    if any(word in query for word in ['about', 'college', 'institution']):
        return college_info['about']
    
    if any(word in query for word in ['course', 'program', 'degree']):
        courses = college_info['courses']
        return "Available courses: " + ", ".join(courses)
    
    if any(word in query for word in ['admission', 'apply', 'enroll']):
        admissions = college_info['admissions']
        return f"Admission Process: {admissions['process']}\nRequirements: {admissions['requirements']}\nDeadlines: {admissions['deadlines']}"
    
    if any(word in query for word in ['facility', 'infrastructure', 'amenity']):
        facilities = college_info['facilities']
        return "College facilities include: " + ", ".join(facilities)

    return "I apologize, but I couldn't find specific information about that. Please try asking about our courses, admissions, facilities, or general information about the college."

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        # Check cache first
        cached_response = await redis.get(message.message)
        if cached_response:
            return {"response": cached_response}

        # Get response from college information
        response = await get_college_info(message.message)
        
        # Cache the response
        await redis.set(message.message, response, ex=3600)  # Cache for 1 hour
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
