import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface RpcResponse {
  data: { response: string } | null;
  error: Error | null;
}

interface ChatResponse {
  response: string;
}

// Cache responses in memory for faster retrieval
const responseCache = new Map<string, { response: string, timestamp: number }>();

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    const currentSessionId = sessionId || uuidv4();

    // Check cache first
    const cacheKey = `${currentSessionId}:${message}`;
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse && Date.now() - cachedResponse.timestamp < 60000) {
      return NextResponse.json({
        response: cachedResponse.response,
        sessionId: currentSessionId
      }, {
        headers: {
          'Cache-Control': 'public, max-age=60'
        }
      });
    }

    // Execute optimized database query
    const { data: matches, error: dbError }: RpcResponse = await supabase
      .rpc('handle_chat_message', {
        session_id: currentSessionId,
        user_message: message
      })
      .single();

    if (dbError) throw dbError;

    const response = matches?.response || 
      "I'm not sure about that. Could you please rephrase your question or ask about admissions, courses, or facilities?";

    // Cache the response
    responseCache.set(cacheKey, {
      response,
      timestamp: Date.now()
    });

    // Clear old cache entries periodically
    if (responseCache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of responseCache.entries()) {
        if (now - value.timestamp > 60000) {
          responseCache.delete(key);
        }
      }
    }

    return NextResponse.json({ 
      response,
      sessionId: currentSessionId
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60'
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
