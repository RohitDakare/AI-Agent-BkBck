import { GoogleGenerativeAI } from "@google/generative-ai";
import { LRUCache } from 'lru-cache';

// Cache with 100 item limit and 5 minute TTL
const responseCache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 5
});

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are BKBCK Assistant, an advanced AI helper for B.K. Birla College.

Key traits:
- Professional and friendly tone
- Precise and accurate information
- Holistic understanding of college operations
- Ability to explain complex topics simply

Focus areas:
1. Academic Programs
2. Admissions Process
3. Campus Facilities
4. Research Initiatives
5. Faculty Information
6. Student Life

Guidelines:
- Always provide factual, up-to-date information
- Maintain a helpful and encouraging tone
- Offer relevant follow-up suggestions
- Acknowledge when specific information isn't available
- Direct users to appropriate resources when needed

Remember: Your goal is to assist students, parents, and visitors in understanding and navigating all aspects of B.K. Birla College.`;

export async function getGeminiResponse(message: string) {
  try {
    // Check cache first
    const cachedResponse = responseCache.get(message);
    if (cachedResponse) {
      return cachedResponse;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `${SYSTEM_PROMPT}

User Query: ${message}

Context: You have access to comprehensive information about B.K. Birla College, including:
- Academic programs and eligibility
- Admission processes and deadlines
- Faculty profiles and achievements
- Campus facilities and infrastructure
- Research initiatives and publications
- Student activities and support services

Please provide a clear, helpful response that directly addresses the query while maintaining a professional and engaging tone.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Cache the response
    responseCache.set(message, responseText);
    
    return responseText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
