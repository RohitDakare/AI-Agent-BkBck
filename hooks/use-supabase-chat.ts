import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface UseChatResult {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: string, sessionId: string | null) => Promise<void>;
  loadChatHistory: (sessionId: string) => Promise<void>;
}

// Cache for storing chat history
const chatHistoryCache = new Map<string, Message[]>();

export function useSupabaseChat(): UseChatResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load chat history with caching
  const loadChatHistory = useCallback(async (sessionId: string) => {
    try {
      // Check cache first
      if (chatHistoryCache.has(sessionId)) {
        setMessages(chatHistoryCache.get(sessionId) || []);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_history')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Update cache
      chatHistoryCache.set(sessionId, formattedMessages);
      setMessages(formattedMessages);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load chat history'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send message with optimized error handling and caching
  const sendMessage = useCallback(async (message: string, sessionId: string | null) => {
    try {
      setIsLoading(true);
      const userMessage = { role: 'user' as const, content: message };
      setMessages(prev => [...prev, userMessage]);

      const { data: response, error } = await supabase
        .rpc('handle_chat_message', {
          session_id: sessionId,
          user_message: message,
        })
        .single();

      if (error) throw error;

      const assistantMessage = {
        role: 'assistant' as const,
        content: response?.response || 'Sorry, I couldn\'t process your request.',
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update cache
      if (sessionId) {
        const updatedMessages = [...messages, userMessage, assistantMessage];
        chatHistoryCache.set(sessionId, updatedMessages);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    loadChatHistory,
  };
}