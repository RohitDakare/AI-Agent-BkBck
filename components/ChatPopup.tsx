'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';

export default function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
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
    if (isOpen) fetchMessages();
  }, [isOpen, fetchMessages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Open chat"
      >
        Ask AI
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm">
          <div className="absolute bottom-20 right-4 w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">College Assistant</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close chat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-2">
              {messages.map((msg, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-lg even:bg-gray-50 odd:bg-blue-50 odd:text-blue-800"
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Type your question..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 