CREATE OR REPLACE FUNCTION handle_chat_message(
  session_id UUID,
  user_message TEXT
) RETURNS TABLE(response TEXT) AS $$
DECLARE
  knowledge_response TEXT;
  search_terms TEXT[];
BEGIN
  -- Store user message
  INSERT INTO chat_history (session_id, role, content)
  VALUES (session_id, 'user', user_message);

  -- Split user message into search terms
  search_terms := string_to_array(lower(user_message), ' ');

  -- Query knowledge base with improved matching
  SELECT content INTO knowledge_response
  FROM knowledge_base
  WHERE (
    EXISTS (
      SELECT 1
      FROM unnest(search_terms) term
      WHERE lower(category) LIKE '%' || term || '%'
      OR lower(topic) LIKE '%' || term || '%'
    )
  )
  ORDER BY
    CASE
      WHEN lower(category) = ANY(search_terms) THEN 1
      WHEN lower(topic) = ANY(search_terms) THEN 2
      ELSE 3
    END,
    created_at DESC
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
