import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getGeminiResponse } from '../lib/gemini';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hello! I'm your BKBCK Assistant. How can I help you learn more about B.K. Birla College?",
};

const CHAT_DIMENSIONS = {
  mobile: {
    default: {
      width: 'w-[calc(100vw-2rem)]',
      height: 'h-[500px]',
    },
    expanded: {
      width: 'w-[calc(100vw-2rem)]',
      height: 'h-[calc(100vh-2rem)]',
    },
  },
  tablet: {
    default: {
      width: 'w-[380px]',
      height: 'h-[600px]',
    },
    expanded: {
      width: 'w-[600px]',
      height: 'h-[calc(100vh-2rem)]',
    },
  },
  desktop: {
    default: {
      width: 'w-[420px]',
      height: 'h-[650px]',
    },
    expanded: {
      width: 'w-[800px]',
      height: 'h-[calc(100vh-2rem)]',
    },
  },
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadChatHistory = async () => {
      const storedSessionId = localStorage.getItem('chatSessionId');
      if (!storedSessionId) return;

      setSessionId(storedSessionId);
      try {
        const { data, error } = await supabase
          .from('chat_history')
          .select('role, content')
          .eq('session_id', storedSessionId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) setMessages(data);
      } catch (error) {
        console.error('Failed to load chat history:', error);
        setError('Failed to load chat history. Please try refreshing the page.');
      }
    };

    loadChatHistory();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!chatRef.current) return;
      
      if (window.innerWidth < 640 && window.innerHeight < window.innerWidth) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveChatMessage = async (message: Message, currentSessionId: string) => {
    try {
      const { error } = await supabase.from('chat_history').insert({
        session_id: currentSessionId,
        role: message.role,
        content: message.content,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Failed to save message:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const currentSessionId = sessionId || uuidv4();
      if (!sessionId) {
        setSessionId(currentSessionId);
        localStorage.setItem('chatSessionId', currentSessionId);
      }

      const userMessageObj = { role: 'user' as const, content: userMessage };
      setMessages(prev => [...prev, userMessageObj]);
      await saveChatMessage(userMessageObj, currentSessionId);

      const response = await getGeminiResponse(userMessage);
      const assistantMessageObj = { role: 'assistant' as const, content: response };
      
      await saveChatMessage(assistantMessageObj, currentSessionId);
      setMessages(prev => [...prev, assistantMessageObj]);
    } catch (error) {
      console.error('Failed to process message:', error);
      setError('Failed to process your message. Please try again.');
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const resetChat = () => {
    localStorage.removeItem('chatSessionId');
    setSessionId(null);
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    if (inputRef.current) inputRef.current.focus();
  };

  const getDimensions = () => {
    if (typeof window === 'undefined') return CHAT_DIMENSIONS.desktop;
    
    if (window.innerWidth < 640) return CHAT_DIMENSIONS.mobile;
    if (window.innerWidth < 1024) return CHAT_DIMENSIONS.tablet;
    return CHAT_DIMENSIONS.desktop;
  };

  const dimensions = getDimensions();
  const currentDimensions = isExpanded ? dimensions.expanded : dimensions.default;

  return (
    <div 
      ref={chatRef}
      className={`fixed ${
        window.innerWidth < 640 ? 'bottom-0 right-0 m-4' : 'bottom-4 right-4'
      } ${currentDimensions.width} ${currentDimensions.height} 
        flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-white rounded-lg shadow-2xl 
        transition-all duration-300 ease-in-out border border-blue-100
        sm:max-w-[90vw] md:max-w-[600px] lg:max-w-[800px]`}
    >
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="text-white h-5 w-5 sm:h-6 sm:w-6" />
          <h2 className="text-base sm:text-lg font-semibold text-white">BKBCK Assistant</h2>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={resetChat}
            className="text-white hover:bg-white/20 p-1.5 sm:p-2 rounded-full transition-colors"
            title="Reset Chat"
          >
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/20 p-1.5 sm:p-2 rounded-full transition-colors"
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? 
              <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" /> : 
              <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
            }
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-3 text-red-700 text-sm border-b border-red-100">
          {error}
        </div>
      )}

      <div 
        className="flex-1 p-3 sm:p-4 overflow-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent" 
        ref={scrollAreaRef}
      >
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`flex gap-2 max-w-[90%] sm:max-w-[85%] ${
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-white to-blue-50 shadow-md'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                } p-3 sm:p-4 rounded-lg ${
                  message.role === 'assistant' ? 'rounded-tl-none' : 'rounded-tr-none'
                }`}
              >
                {message.role === 'assistant' && (
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-1" />
                )}
                <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{message.content}</p>
                {message.role === 'user' && (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-white to-blue-50 p-3 sm:p-4 rounded-lg rounded-tl-none shadow-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-blue-100 bg-white/50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about admissions, courses, facilities..."
            disabled={isLoading}
            className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 sm:p-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-indigo-600 transition-all duration-200"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}