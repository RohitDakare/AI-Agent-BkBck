CREATE OR REPLACE FUNCTION handle_chat_message(
  session_id UUID,
  user_message TEXT
) RETURNS TABLE(response TEXT) AS $$
DECLARE
  knowledge_response TEXT;
BEGIN
  -- Store user message
  INSERT INTO chat_history (session_id, role, content)
  VALUES (session_id, 'user', user_message);

  -- Query knowledge base
  SELECT content INTO knowledge_response
  FROM knowledge_base
  WHERE category ILIKE '%' || user_message || '%'
     OR topic ILIKE '%' || user_message || '%'
  LIMIT 1;

  -- Store assistant response
  INSERT INTO chat_history (session_id, role, content)
  VALUES (session_id, 'assistant', 
    COALESCE(knowledge_response, 
      'I''m not sure about that. Could you please rephrase your question or ask about admissions, courses, or facilities?')
  );

  -- Return response
  RETURN QUERY SELECT 
    COALESCE(knowledge_response, 
      'I''m not sure about that. Could you please rephrase your question or ask about admissions, courses, or facilities?')
    AS response;
END;
$$ LANGUAGE plpgsql;
