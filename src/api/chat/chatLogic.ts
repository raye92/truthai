// Chat business logic and utilities
import { chatAPI } from './chatAPI';
import { useChatStore } from './chatStore';
import { Conversation, Message } from './types';

export class ChatLogic {
  // Create a new conversation with type parameter and date
  static async createConversation(type: "Chat" | "Short-response" | "Long-form", userId?: string): Promise<string> {
    try {
      // ==== CHECK LOGIN ====
      if (!userId) {
        throw new Error('User must be logged in to create a conversation');
      }

      // Create title with type and date
      const today = new Date().toLocaleDateString();
      const title = `${type} - ${today}`;

      // API create conversation
      const conversationId = await chatAPI.createConversation(title, userId);

      // Create conversation object for store
      const newConversation: Conversation = {
        conversationId,
        title,
        messages: []
      };

      // Update store
      const store = useChatStore.getState();
      store.addConversation(newConversation);
      store.setCurrentConversation(newConversation);

      return conversationId;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Load conversations for a user
  static async loadConversations(userId: string): Promise<void> {
    try {
      // ==== CHECK LOGIN ====
      if (!userId) {
        throw new Error('User must be logged in to load conversations');
      }

      // API load conversations
      const response = await chatAPI.loadConversations(userId);

      // Convert to conversation objects with empty message arrays
      const conversations: Conversation[] = response.conversations.map(conv => ({
        conversationId: conv.id,
        title: conv.title,
        messages: []
      }));

      // Update store
      useChatStore.getState().setConversations(conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      throw error;
    }
  }

  // Add a message to conversation (both store and DB if logged in)
  static async addMessage(
    conversationId: string, 
    role: 'user' | 'assistant', 
    content: string, 
    provider: string, 
    model: string,
    userId?: string
  ): Promise<string> {
    try {
      // Create message object
      const message: Message = {
        messageId: '', // Will be set by API response
        role,
        content,
        metadata: {
          provider,
          model
        }
      };

      // Add to store immediately
      useChatStore.getState().addMessage(conversationId, message);

      // ==== CHECK LOGIN ====
      if (userId) {
        // API add message to DB
        const messageId = await chatAPI.addMessage(conversationId, role, content, provider, model);
        // Update message with actual ID from API
        message.messageId = messageId;
      }

      return message.messageId;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  // Load messages for current conversation from DynamoDB
  static async loadMessages(conversationId: string): Promise<void> {
    try {
      // API load messages
      const response = await chatAPI.loadMessages(conversationId);

      // Update current conversation's messages in store
      const store = useChatStore.getState();
      if (store.currentConversation?.conversationId === conversationId) {
        // Update the current conversation's messages
        const updatedConversation = {
          ...store.currentConversation,
          messages: response.messages
        };
        store.setCurrentConversation(updatedConversation);
      }

      // Also update the conversation in the conversations array
      const conversations = store.conversations.map(conv => 
        conv.conversationId === conversationId 
          ? { ...conv, messages: response.messages }
          : conv
      );
      store.setConversations(conversations);
    } catch (error) {
      console.error('Error loading messages:', error);
      throw error;
    }
  }


}
