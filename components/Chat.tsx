'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ content: string }[]>([]);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('chat_history')
      .select('content')
      .order('created_at', { ascending: true });
    if (data) setMessages(data);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await supabase
      .from('chat_history')
      .insert([{ content: input.trim() }]);

    setInput('');
    await fetchMessages();
  }, [input, fetchMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="h-96 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 even:bg-gray-100 rounded">
            {msg.content}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type your question..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
} 