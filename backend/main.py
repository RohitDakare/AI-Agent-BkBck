from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    
    # Simple keyword matching
    if "admission" in message:
        if "process" in message:
            return knowledge_base["admissions"]["process"]
        elif "requirement" in message:
            return knowledge_base["admissions"]["requirements"]
        elif "deadline" in message:
            return knowledge_base["admissions"]["deadlines"]
        return "What specific information about admissions would you like to know?"
    
    elif "course" in message or "program" in message:
        if "duration" in message:
            return knowledge_base["courses"]["duration"]
        elif "credit" in message:
            return knowledge_base["courses"]["credits"]
        return knowledge_base["courses"]["programs"]
    
    elif "facility" in message or "facilities" in message:
        if "library" in message:
            return knowledge_base["facilities"]["library"]
        elif "lab" in message:
            return knowledge_base["facilities"]["labs"]
        elif "sport" in message:
            return knowledge_base["facilities"]["sports"]
        return "We have various facilities including a library, labs, and sports facilities. What would you like to know about specifically?"
    
    return "I'm not sure about that. Could you please rephrase your question or ask about admissions, courses, or facilities?"

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        response = get_response(message.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))