import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

class ChatAPI {
  // Create a new conversation
  async createConversation(title: string, userId: string): Promise<string> {
    try {
      const { data: conversation } = await client.models.Conversation.create({
        title: [title],
        userId: [userId],
      });
      
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
        conversationId: [conversationId],
        role: [role],
        content: [content],
        metadata: [JSON.stringify({
          provider,
          model
        })]
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
  
  // Load conversations (20 most recent, optionally after a specific time)
  async loadConversations(userId: string, afterTime?: Date): Promise<any> {
    try {
      let filter: any = {
        userId: { eq: userId }
      };

      // If afterTime is provided, filter conversations created after that time
      if (afterTime) {
        filter.createdAt = { gt: afterTime.toISOString() };
      }

      const { data: conversations } = await client.models.Conversation.list({
        filter,
        limit: 20
      });
      
      if (!conversations) {
        return { conversations: [] };
      }

      // Sort by createdAt descending (most recent first)
      const sortedConversations = conversations.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        conversations: sortedConversations.map((conv: any) => ({
          id: conv.id,
          title: conv.title,
          updatedBy: conv.createdAt
        }))
      };
    } catch (error) {
      console.error('Error loading conversations:', error);
      throw error;
    }
  }
  
  // Load messages for a specific conversation (20 most recent, optionally after a specific time)
  async loadMessages(conversationId: string, afterTime?: Date): Promise<any> {
    try {
      let filter: any = {
        conversationId: { eq: conversationId }
      };

      // If afterTime is provided, filter messages created after that time
      if (afterTime) {
        filter.createdAt = { gt: afterTime.toISOString() };
      }

      const { data: messages } = await client.models.Message.list({
        filter,
        limit: 20
      });
      
      if (!messages) {
        return { messages: [] };
      }

      // Sort by createdAt descending (most recent first)
      const sortedMessages = messages.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        messages: sortedMessages.map((msg: any) => ({
          messageId: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          metadata: msg.metadata as { provider: string; model: string }
        }))
      };
    } catch (error) {
      console.error('Error loading messages:', error);
      throw error;
    }
  }
}

export const chatAPI = new ChatAPI();
