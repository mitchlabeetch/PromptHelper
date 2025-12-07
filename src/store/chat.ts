import { create } from 'zustand';
import { ChatState } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: 'init-1',
      role: 'assistant',
      content: "Hello. I am your Prompt Architect. Tell me what you want to build, and I'll find the right tools and strategy for you.",
      timestamp: 0 // Static to prevent hydration mismatch
    }
  ],
  isLoading: false,
  streamingContent: "",

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: uuidv4(), timestamp: Date.now() }]
  })),

  resetChat: () => set({
    messages: [{
      id: 'init-1',
      role: 'assistant',
      content: "Hello. I am your Prompt Architect. Tell me what you want to build, and I'll find the right tools and strategy for you.",
      timestamp: 0
    }],
    isLoading: false
  }),

  sendMessage: async (content: string) => {
    const { addMessage, messages } = get();
    
    // 1. Add User Message
    addMessage({ role: 'user', content });
    set({ isLoading: true });

    try {
      // 2. Call Chat API
      const history = [...messages, { role: 'user', content }];
      
      const res = await fetch('/api/architect/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Chat failed");

      // 3. Add Assistant Response (Text + Potential Artifact)
      addMessage({ 
        role: 'assistant', 
        content: data.content,
        artifact: data.artifact 
      });

    } catch {
      addMessage({ 
        role: 'assistant', 
        content: "I encountered a connection error. Please try again." 
      });
    } finally {
      set({ isLoading: false });
    }
  }
}));
