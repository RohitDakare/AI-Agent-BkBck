import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    const currentSessionId = sessionId || uuidv4();

    // Store user message
    await supabase.from('chat_history').insert({
      session_id: currentSessionId,
      role: 'user',
      content: message,
    });

    // Query knowledge base
    const { data: matches, error: queryError } = await supabase
      .from('knowledge_base')
      .select('content')
      .or(`category.ilike.%${message}%,topic.ilike.%${message}%`)
      .limit(1);

    if (queryError) throw queryError;

    const response = matches && matches.length > 0
      ? matches[0].content
      : "I'm not sure about that. Could you please rephrase your question or ask about admissions, courses, or facilities?";

    // Store assistant response
    await supabase.from('chat_history').insert({
      session_id: currentSessionId,
      role: 'assistant',
      content: response,
    });

    return NextResponse.json({ 
      response,
      sessionId: currentSessionId
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}