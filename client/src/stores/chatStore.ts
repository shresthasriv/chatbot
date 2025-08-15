import { create } from 'zustand'
import type { Chat, Message } from '@shared/schema'

interface ChatStore {
  activeChat: string | null
  chats: Chat[]
  messages: Message[]
  loading: boolean
  error: string | null
  isTyping: boolean
  
  setActiveChat: (chatId: string | null) => void
  setChats: (chats: Chat[]) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setTyping: (isTyping: boolean) => void
  clearChat: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  activeChat: null,
  chats: [],
  messages: [],
  loading: false,
  error: null,
  isTyping: false,

  setActiveChat: (chatId) => set({ activeChat: chatId }),
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setTyping: (isTyping) => set({ isTyping }),
  clearChat: () => set({ 
    activeChat: null, 
    messages: [], 
    error: null, 
    isTyping: false 
  }),
}))
