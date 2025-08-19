import { create } from 'zustand';
import { produce } from 'immer';
import { Conversation, Message } from './types';

interface ChatState {
  // State properties
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  nextChatToken: string | null;
  nextMessageToken: string | null;
  
  // Actions
  setCurrentConversation: (conversation: Conversation | null) => void;
  addConversations: (conversations: Conversation[]) => void;
  setNextChatToken: (token: string | null) => void;
  setNextMessageToken: (token: string | null) => void;
  setCurrentMessages: (messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversation: null,
  isLoading: false,
  nextChatToken: "empty",
  nextMessageToken: "empty",
  
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

  setNextChatToken: (token) => {
    set(produce((state) => {
      state.nextChatToken = token;
    }));
  },

  setNextMessageToken: (token) => {
    set(produce((state) => {
      state.nextMessageToken = token;
    }));
  },

  setCurrentMessages: (messages) => {
    set(produce((state) => {
      if (state.currentConversation) {
        state.currentConversation.messages.push(...messages);
      }
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
