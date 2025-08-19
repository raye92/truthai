import { create } from 'zustand';
import { produce } from 'immer';
import { Conversation, Message } from './types';

interface ChatState {
  // State properties
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  nextToken: string | null;
  
  // Actions
  setCurrentConversation: (conversation: Conversation | null) => void;
  addConversations: (conversations: Conversation[]) => void;
  setnextToken: (token: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversation: null,
  isLoading: false,
  nextToken: null,
  
  // Actions
  setCurrentConversation: (conversation) => {
    set(produce((state) => {
      state.currentConversation = conversation;
    }));
  },

  addConversations: (conversations) => {
    set(produce((state) => {
      // Append older conversations at the end of the list
      state.conversations.push(...conversations);
    }));
  },

  setnextToken: (token) => {
    set(produce((state) => {
      state.nextToken = token;
    }));
  },
  
  addMessage: (conversationId, message) => {
    set(produce((state) => {
      const conversation = state.conversations.find((c: any) => c.conversationId === conversationId);
      if (conversation) {
        conversation.messages.push(message);
      }
      
      if (state.currentConversation?.conversationId === conversationId) {
        state.currentConversation.messages.push(message);
      }
    }));
  },
}));
