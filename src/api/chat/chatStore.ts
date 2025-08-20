import { create } from 'zustand';
import { produce } from 'immer';
import { Conversation, Message } from './types';

interface ChatState {
  // State properties
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  nextChatToken: string | null;
  
  // Actions
  setCurrentConversation: (conversation: Conversation | null) => void;
  addConversations: (conversations: Conversation[]) => void;
  prependConversation: (conversation: Conversation) => void;
  setNextChatToken: (token: string | null) => void;
  addCurrentMessages: (messages: Message[]) => void;
  prependMessage: (message: Message) => void;
  setConversationNextMessageToken: (token: string | null) => void;
  clearConversations: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversation: null,
  isLoading: false,
  nextChatToken: "empty",
  
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

  // Put a new conversation at the beginning of the list (most recent first)
  prependConversation: (conversation) => {
    set(produce((state) => {
      state.conversations.unshift(conversation);
    }));
  },

  setNextChatToken: (token) => {
    set(produce((state) => {
      state.nextChatToken = token;
    }));
  },

  addCurrentMessages: (messages) => {
    set(produce((state) => {
      const inListConv = state.conversations.find((c: any) => c.conversationId === state.currentConversation?.conversationId);
      if (inListConv) {
        inListConv.messages.push(...messages);
      }

      state.currentConversation.messages.push(...messages); // TODO: remove this
    }));
  },
  
  prependMessage: (message) => {
    set(produce((state) => {
      const inListConv = state.conversations.find((c: any) => c.conversationId === state.currentConversation?.conversationId);
      if (inListConv) {
        inListConv.messages.push(message);
      }

      state.currentConversation.messages.unshift(message);
    }));
  },

  // Update nextMessageToken for a specific conversation in both locations
  setConversationNextMessageToken: (token) => {
    set(produce((state) => {
      const inListConv = state.conversations.find((c: any) => c.conversationId === state.currentConversation?.conversationId);
      if (inListConv) {
        inListConv.nextMessageToken = token;
      }
      state.currentConversation.nextMessageToken = token;
    }));
  },

  clearConversations: () => {
    set(produce((state) => {
      state.conversations = [];
      state.currentConversation = null;
      state.nextChatToken = "empty";
    }));
  },
}));
