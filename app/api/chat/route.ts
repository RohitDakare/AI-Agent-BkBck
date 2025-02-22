import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface RpcResponse {
  data: { response: string } | null;
  error: Error | null;
}

interface ChatResponse {
  response: string;
}

// Initialize Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL
});

(async () => {
  await redisClient.connect();
})();

// Async cache cleanup
const cleanupCache = async () => {
  try {
    const keys = await redisClient.keys('*');
    const now = Date.now();
    
    for (const key of keys) {
      const cached = await redisClient.hGetAll(key);
      if (cached.timestamp && now - parseInt(cached.timestamp) > 60000) {
        await redisClient.del(key);
      }
    }
  } catch (error) {
    console.error('Cache cleanup error:', error);
  }
};

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    const currentSessionId = sessionId || uuidv4();
    const cacheKey = `${currentSessionId}:${message}`;

    // Check Redis cache first
    const cachedResponse = await redisClient.hGetAll(cacheKey);
    
    if (cachedResponse.response && cachedResponse.timestamp && 
        Date.now() - parseInt(cachedResponse.timestamp) < 60000) {
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

    // Cache the response in Redis
    await redisClient.hSet(cacheKey, {
      response,
      timestamp: Date.now().toString()
    });

    // Schedule async cache cleanup if needed
    const cacheSize = await redisClient.dbSize();
    if (cacheSize > 1000) {
      cleanupCache();
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
