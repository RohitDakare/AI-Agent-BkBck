'use client';

import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { X, MessageCircle } from 'lucide-react';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
};

export default function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_history')
        .select('id, content, role, created_at')
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const newMessage = {
        content: input.trim(),
        role: 'user' as const,
      };

      // Optimistic update
      setMessages(prev => [...prev, { 
        ...newMessage, 
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }]);

      const { error } = await supabase
        .from('chat_history')
        .insert([newMessage]);

      if (error) throw error;
      
      setInput('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      // Rollback optimistic update
      setMessages(prev => prev.slice(0, -1));
    }
  }, [input, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      inputRef.current?.focus();
    }
  }, [isOpen, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="presentation"
        >
          <div 
            className="absolute bottom-20 right-4 w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold">College Assistant</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 h-96 overflow-y-auto p-4 space-y-4 relative">
              {isLoading ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages yet. Start a conversation!</div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.role === 'user' 
                        ? 'ml-auto bg-blue-600 text-white' 
                        : 'mr-auto bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                  placeholder="Type your question..."
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isLoading || !input.trim()}
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