// Chat business logic and utilities
import { chatAPI } from './chatAPI';
import { useChatStore } from './chatStore';
import { Conversation, Message } from './types';
import { getCurrentUser } from '@aws-amplify/auth';

export class ChatLogic {
  // Create a new conversation with type parameter and date
  static async createConversation(type: "Chat" | "Short-response" | "Long-form"): Promise<string> {
    // Create title with type and date
    const today = new Date().toLocaleDateString();
    const title = `${type} - ${today}`;
    let conversationId = '';

    const user = await getCurrentUser();
    if (user.userId) {
      conversationId = await chatAPI.createConversation(title, user.userId);
    }

    const newConversation: Conversation = {
      conversationId,
      title,
      messages: []
    };

    useChatStore.getState().addConversations([newConversation]);
    useChatStore.getState().setCurrentConversation(newConversation);

    return conversationId;
  }

  // Load the 10 most recent conversations w/ pagination
  static async loadConversations(): Promise<void> {
    const user = await getCurrentUser();
    if (!user.userId) return;
    
    const { conversations, nextToken: newNextToken } = await chatAPI.loadConversations(user.userId, useChatStore.getState().nextToken || undefined);

    const mapped: Conversation[] = conversations.map((conv: any) => ({
      conversationId: conv.id,
      title: conv.title,
      messages: []
    }));

    useChatStore.getState().addConversations(mapped);
    useChatStore.getState().setnextToken(newNextToken);
  }

  // Add a message to conversation (both store and DB if logged in)
  static async addMessage(conversationId: string, role: 'user' | 'assistant', content: string, provider: string, model: string): Promise<string> {
    let messageId = '';
    
    // ==== CHECK LOGIN ====
    const user = await getCurrentUser();
    if (user.userId) {
      messageId = await chatAPI.addMessage(conversationId, role, content, provider, model);
    }

    const message: Message = {
      messageId,
      role,
      content,
      metadata: {
        provider,
        model
      }
    };

    useChatStore.getState().addMessage(conversationId, message);

    return messageId;
  }

  // Load messages for current conversation from DynamoDB
  static async loadMessages(conversationId: string): Promise<void> {
    
  }
}
