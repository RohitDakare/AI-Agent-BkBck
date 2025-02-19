import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    const currentSessionId = sessionId || uuidv4();

    // Batch all database operations
    const { data: matches, error: dbError } = await supabase
      .rpc('handle_chat_message', {
        session_id: currentSessionId,
        user_message: message
      });

    if (dbError) throw dbError;

    const response = matches?.response || 
      "I'm not sure about that. Could you please rephrase your question or ask about admissions, courses, or facilities?";

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
