// Chat business logic and utilities
import { chatAPI } from './chatAPI';
import { useChatStore } from './chatStore';
import { Conversation, Message } from './types';
import { getCurrentUser } from '@aws-amplify/auth';

export class ChatLogic {
  // Local incremental id for unsaved conversations
  private static localConversationIdCounter = 0;
  // Gracefully handle unauthenticated users
  private static async getCurrentUserSafe(): Promise<{ userId: string } | null> {
    try {
      const user = await getCurrentUser();
      return user as { userId: string };
    } catch {
      return null;
    }
  }
  // Create a new conversation with type parameter and date
  static async createConversation(type: "Chat" | "Short-response" | "Long-form" | "Explain"): Promise<string> {
    // Create title with type and date
    const today = new Date().toLocaleDateString();
    const title = `${type} - ${today}`;
    let conversationId = String(ChatLogic.localConversationIdCounter++);

    const newConversation: Conversation = {
      conversationId,
      title,
      messages: [],
      nextMessageToken: null,
      isSaved: false,
    };

    useChatStore.getState().prependConversation(newConversation);
    useChatStore.getState().setCurrentConversationId(newConversation.conversationId);

    return conversationId;
  }

  // Load the 10 most recent conversations w/ pagination
  static async loadConversations(): Promise<void> {
    const user = await ChatLogic.getCurrentUserSafe();
    if (!user?.userId || !useChatStore.getState().nextChatToken) return;
    const { conversations, nextToken: newNextToken } = await chatAPI.loadConversations(user.userId, useChatStore.getState().nextChatToken || undefined);

    const mapped: Conversation[] = conversations.map((conv: any) => ({
      conversationId: conv.id,
      title: conv.title,
      messages: [],
      nextMessageToken: "empty",
      isSaved: true,
    }));
    useChatStore.getState().addConversations(mapped);
    useChatStore.getState().setNextChatToken(newNextToken);
  }

  // Add a message to conversation (both store and DB if logged in)
  static async addMessage(conversationId: string, role: 'user' | 'assistant', content: string, provider: string, model: string): Promise<string> {
    let messageId = '';

    const store = useChatStore.getState();
    const conv = store.conversations.find(c => c.conversationId === conversationId);
    
    // Only persist to backend if conversation is saved
    const user = await ChatLogic.getCurrentUserSafe();
    if (user?.userId && conv?.isSaved) {
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

    store.prependMessage(conversationId, message);

    return messageId;
  }

  // Load messages for current conversation from DynamoDB
  static async loadMessages(conversationId: string): Promise<void> {
    const store = useChatStore.getState();
    const user = await ChatLogic.getCurrentUserSafe();

    const currentConv = store.conversations.find(c => c.conversationId === conversationId);
    if (!user?.userId || !currentConv?.nextMessageToken) return;
    const { messages, nextToken: newNextMessageToken } = await chatAPI.loadMessages(
      conversationId, 
      currentConv.nextMessageToken || undefined
    );
    const mapped: Message[] = messages.map((msg: any) => ({
      messageId: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      metadata: JSON.parse(msg.metadata)
    }));
    
    store.setConversationNextMessageToken(conversationId, newNextMessageToken);
    store.addMessages(conversationId, mapped);
  }

  static async saveConversation(conversationId: string): Promise<void> {
    const store = useChatStore.getState();
    const conv = store.conversations.find(c => c.conversationId === conversationId);
    const user = await ChatLogic.getCurrentUserSafe();
    if (!user?.userId || !conv) return;

    await chatAPI.saveConversation(conv.title, user.userId, conv.messages);
    store.saveConversation(conversationId);
  }

  static async deleteConversation(conversationId: string): Promise<void> {
    const store = useChatStore.getState();

    const conv = store.conversations.find(c => c.conversationId === conversationId);
    const messages = conv?.messages ?? [];
    const user = await ChatLogic.getCurrentUserSafe();
    if (user?.userId && conv?.isSaved) {
      await chatAPI.deleteConversation(conversationId, messages);
    }
    store.deleteConversation(conversationId);
  }
}
