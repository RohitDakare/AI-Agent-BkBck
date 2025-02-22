from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import redis
import json
import os
import asyncio
from typing import Dict, Any

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Redis
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    db=0
)

class ChatMessage(BaseModel):
    message: str

# Load knowledge base
knowledge_base = {
    "admissions": {
        "process": "Our admission process involves submitting an online application, required documents, and an entrance exam.",
        "requirements": "Basic requirements include high school transcripts, standardized test scores, and letters of recommendation.",
        "deadlines": "Early admission deadline is October 15, regular admission deadline is January 15.",
    },
    "courses": {
        "programs": "We offer undergraduate programs in Computer Science, Engineering, Business, and Arts.",
        "duration": "Most undergraduate programs are 4 years in duration.",
        "credits": "Each program requires 120 credits for graduation.",
    },
    "facilities": {
        "library": "Our library is open 24/7 with over 100,000 books and online resources.",
        "labs": "We have state-of-the-art computer labs, science labs, and research facilities.",
        "sports": "Our campus includes a gymnasium, swimming pool, and various sports courts.",
    },
}

def get_response(message: str) -> str:
    message = message.lower()
    
    # Check Redis cache first
    cached_response = redis_client.get(message)
    if cached_response:
        return cached_response.decode('utf-8')
    
    # More efficient keyword matching using sets
    keywords = set(message.split())
    admissions_keywords = {'admission', 'apply', 'application'}
    courses_keywords = {'course', 'program', 'degree'}
    facilities_keywords = {'facility', 'library', 'lab', 'sport'}
    
    if keywords & admissions_keywords:
        if 'process' in keywords:
            response = knowledge_base["admissions"]["process"]
        elif 'requirement' in keywords:
            response = knowledge_base["admissions"]["requirements"]
        elif 'deadline' in keywords:
            response = knowledge_base["admissions"]["deadlines"]
        else:
            response = "What specific information about admissions would you like to know?"
    elif keywords & courses_keywords:
        if 'duration' in keywords:
            response = knowledge_base["courses"]["duration"]
        elif 'credit' in keywords:
            response = knowledge_base["courses"]["credits"]
        else:
            response = knowledge_base["courses"]["programs"]
    elif keywords & facilities_keywords:
        if 'library' in keywords:
            response = knowledge_base["facilities"]["library"]
        elif 'lab' in keywords:
            response = knowledge_base["facilities"]["labs"]
        elif 'sport' in keywords:
            response = knowledge_base["facilities"]["sports"]
        else:
            response = "We have various facilities including a library, labs, and sports facilities. What would you like to know about specifically?"
    else:
        response = "I'm not sure about that. Could you please rephrase your question or ask about admissions, courses, or facilities?"
    
    # Cache the response
    redis_client.set(message, response, ex=3600)  # Cache for 1 hour
    
    return response

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        response = await asyncio.to_thread(get_response, message.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
