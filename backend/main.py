from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
import aioredis
import asyncio
import json
import os

app = FastAPI()

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

# Optimized knowledge base with better structure
KNOWLEDGE_BASE = {
    "admissions": {
        "process": {
            "keywords": ["admission", "process", "how", "apply"],
            "response": "Our admission process involves: 1. Online application submission 2. Required documents upload 3. Entrance exam"
        },
        "requirements": {
            "keywords": ["requirements", "need", "documents"],
            "response": "Required documents: 1. High school transcripts 2. Standardized test scores 3. Recommendation letters"
        },
        "deadlines": {
            "keywords": ["deadline", "dates", "when"],
            "response": "Early admission: October 15 | Regular admission: January 15"
        }
    },
    "courses": {
        "programs": {
            "keywords": ["programs", "courses", "study"],
            "response": "Available programs: Computer Science, Engineering, Business, Arts"
        },
        "duration": {
            "keywords": ["duration", "long", "years"],
            "response": "Most undergraduate programs are 4 years in duration"
        }
    }
}

async def search_knowledge_base(query: str) -> str:
    query = query.lower()
    words = set(query.split())
    
    best_match = None
    highest_score = 0
    
    for category in KNOWLEDGE_BASE.values():
        for info in category.values():
            score = sum(1 for keyword in info["keywords"] if keyword in words)
            if score > highest_score:
                highest_score = score
                best_match = info["response"]
    
    return best_match or "I apologize, but I don't have enough information to answer that question accurately. Could you please rephrase or ask about admissions, courses, or facilities?"

async def get_cached_response(message: str) -> Optional[str]:
    if redis:
        return await redis.get(message)
    return None

async def cache_response(message: str, response: str):
    if redis:
        await redis.set(message, response, ex=3600)  # Cache for 1 hour

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        # Check cache first
        cached_response = await get_cached_response(message.message)
        if cached_response:
            return {"response": cached_response}

        # Search knowledge base
        response = await search_knowledge_base(message.message)
        
        # Cache the response
        await cache_response(message.message, response)
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
