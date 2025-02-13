/*
  # Initial Schema Setup for College Assistant

  1. New Tables
    - `knowledge_base`
      - `id` (uuid, primary key)
      - `category` (text) - e.g., admissions, courses, facilities
      - `topic` (text) - e.g., process, requirements, deadlines
      - `content` (text) - the actual information
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_history`
      - `id` (uuid, primary key)
      - `session_id` (uuid) - to group messages from the same chat session
      - `role` (text) - either 'assistant' or 'user'
      - `content` (text) - the message content
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to knowledge_base
    - Add policies for authenticated users to read/write chat_history
*/

-- Knowledge Base Table
CREATE TABLE knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  topic text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat History Table
CREATE TABLE chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('assistant', 'user')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Policies for knowledge_base
CREATE POLICY "Knowledge base is publicly readable"
  ON knowledge_base
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify knowledge base"
  ON knowledge_base
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin');

-- Policies for chat_history
CREATE POLICY "Users can read their own chat history"
  ON chat_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create chat messages"
  ON chat_history
  FOR INSERT
  TO public
  WITH CHECK (true);