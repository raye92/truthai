import { create } from 'zustand';
import { produce } from 'immer';
import { Conversation, Message } from './types';

interface ChatState {
  // State properties
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  nextChatToken: string | null;
  
  // Actions
  setCurrentConversationId: (conversationId: string | null) => void;
  addConversations: (conversations: Conversation[]) => void;
  prependConversation: (conversation: Conversation) => void;
  setNextChatToken: (token: string | null) => void;
  addMessages: (conversationId: string, messages: Message[]) => void;
  prependMessage: (conversationId: string, message: Message) => void;
  setConversationNextMessageToken: (conversationId: string, token: string | null) => void;
  clearConversations: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  nextChatToken: "empty",
  
  // Actions
  setCurrentConversationId: (conversationId) => {
    const currentId = get().currentConversationId; // Avoid redundant updates
    if (currentId === conversationId) return;
    console.log('Setting current conversationId:', conversationId);
    set(produce((state) => {
      state.currentConversationId = conversationId;
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

  // Append older, paginated messages to the end (we render reversed in UI)
  addMessages: (conversationId, messages) => {
    set(produce((state) => {
      const conv = state.conversations.find((c: Conversation) => c.conversationId === conversationId);
      if (conv) {
        conv.messages.push(...messages);
      }
    }));
  },
  
  // Prepend the newest message to the start
  prependMessage: (conversationId, message) => {
    set(produce((state) => {
      const conv = state.conversations.find((c: Conversation) => c.conversationId === conversationId);
      if (conv) {
        conv.messages.unshift(message);
      }
    }));
  },

  // Update nextMessageToken for a specific conversation
  setConversationNextMessageToken: (conversationId, token) => {
    set(produce((state) => {
      const conv = state.conversations.find((c: Conversation) => c.conversationId === conversationId);
      if (conv) {
        conv.nextMessageToken = token;
      }
    }));
  },

  clearConversations: () => {
    set(produce((state) => {
      state.conversations = [];
      state.currentConversationId = null;
      state.nextChatToken = "empty";
    }));
  },
}));
