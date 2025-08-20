import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

class ChatAPI {
  // Create a new conversation
  async createConversation(title: string, userId: string): Promise<string> {
    try {
      console.log('Creating conversation:', title, userId);
      const { data: conversation, errors } = await client.models.Conversation.create({
        title: title,
        userId: userId,
      });
      
      console.log('Conversation created:', conversation, errors);
      if (!conversation) {
        throw new Error('Failed to create conversation');
      }
      
      return conversation.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }
  
  // Add a message to a conversation
  async addMessage(conversationId: string, role: 'user' | 'assistant', content: string, provider: string, model: string): Promise<string> {
    try {
      const { data: message } = await client.models.Message.create({
        conversationId: conversationId,
        role: role,
        content: content,
        metadata: JSON.stringify({
          provider,
          model
        })
      });
      
      if (!message) {
        throw new Error('Failed to create message');
      }
      
      return message.id;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }
  
  // Load the "limit" most recent conversations w/ pagination - null if no more conversations
  async loadConversations(userId: string, nextToken?: string): Promise<{ conversations: Array<{ id: string; title: string }>; nextToken: string | null } > {
    try {
      if (!nextToken) {
        return { conversations: [], nextToken: null };
      }
      else if (nextToken === "empty") {
        nextToken = undefined;
      }
      const { data, nextToken: newNextToken } = await (client.models.Conversation as any).listConversationByUserIdAndUpdatedAt({
        userId,
        sortDirection: 'DESC',
        limit: 10,
        nextToken,
      });

      const conversations = (data ?? []).map((conv: any) => ({ id: conv.id, title: conv.title }));
      return { conversations, nextToken: newNextToken ?? null };
    } catch (error) {
      console.error('Error loading conversations:', error);
      throw error;
    }
  }
  
  // Load the "limit" most recent messages w/ pagination - null if no more messages
  async loadMessages(conversationId: string, nextToken?: string): Promise<{ messages: Array<{ id: string; role: string; content: string; metadata: string }>; nextToken: string | null }> {
    try {
      if (!nextToken) {
        return { messages: [], nextToken: null };
      }
      else if (nextToken === "empty") {
        nextToken = undefined;
      }
      const { data, nextToken: newNextToken } = await (client.models.Message as any).listMessageByConversationIdAndUpdatedAt({
        conversationId,
        sortDirection: 'DESC',
        limit: 2,
        nextToken,
      });

      return { messages: data ?? [], nextToken: newNextToken ?? null };
    } catch (error) {
      console.error('Error loading messages:', error);
      throw error;
    }
  }
}

export const chatAPI = new ChatAPI();
