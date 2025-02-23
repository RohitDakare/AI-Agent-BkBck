import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isExpanded: boolean;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setExpanded: (expanded: boolean) => void;
}

export const useChatStore = create<ChatState>(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      isExpanded: false,
      setMessages: (messages) => set({ messages }),
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      clearMessages: () => set({ messages: [] }),
      setLoading: (loading) => set({ isLoading: loading }),
      setExpanded: (expanded) => set({ isExpanded: expanded }),
    }),
    {
      name: 'chat-store',
    }
  )
);