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
    const user = await getCurrentUser();
    if (!user.userId || !useChatStore.getState().nextChatToken) return;
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
    const user = await getCurrentUser();
    if (user.userId && conv?.isSaved) {
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
    const user = await getCurrentUser();

    const currentConv = store.conversations.find(c => c.conversationId === conversationId);
    if (!user.userId || !currentConv?.nextMessageToken) return;
    const { messages, nextToken: newNextMessageToken } = await chatAPI.loadMessages(
      conversationId, 
      currentConv.nextMessageToken || undefined
    );
    console.log('Loaded messages:', messages);
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
    if (!conv) return;

    // Mark saved locally first for immediate UI feedback
    store.saveConversation(conversationId);

    // Persist remotely
    const user = await getCurrentUser();
    if (!user.userId) return;

    // If the conversation exists server-side already, we can reuse id
    // ======== CHECK LOGIC ======== assumes conversation row may or may not exist yet
    const persistedId = await chatAPI.saveConversation(
      conv.title,
      user.userId,
      conv.messages,
      conv.conversationId || undefined
    );

    // Optionally reconcile local id/state if a new id was created
    // ======== CHECK LOGIC ======== if save creates a new id, update local state here
  }

  static async deleteConversation(conversationId: string): Promise<void> {
    const store = useChatStore.getState();

    // Update UI state first
    store.deleteConversation(conversationId);

    // Delete remotely if exists
    const user = await getCurrentUser();
    if (!user.userId) return;

    await chatAPI.deleteConversation(conversationId);
  }
}
