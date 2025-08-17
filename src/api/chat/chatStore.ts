import { create } from 'zustand';
import { produce } from 'immer';
import { Conversation, Message } from './types';

interface ChatState {
  // State properties
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  
  // Actions
  setCurrentConversation: (conversation: Conversation | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  addMessage: (conversationId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversation: null,
  isLoading: false,
  
  // Actions
  setCurrentConversation: (conversation) => {
    set(produce((state) => {
      state.currentConversation = conversation;
    }));
  },

  setConversations: (conversations) => {
    set(produce((state) => {
      state.conversations = conversations;
    }));
  },
  
  addConversation: (conversation) => {
    set(produce((state) => {
      state.conversations.unshift(conversation);
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
