import { useState } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

// ======== SEPARATE TWO CLIENTS IF MORE IMPORTS ========
// const client = generateClient<Schema>();
// Generate client with API key auth for public access
const client = generateClient<Schema>({
  authMode: 'apiKey'
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}

export type ModelType = 'chatgpt' | 'gemini';

export interface ChatOptions {
  model: ModelType;
  useGrounding?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string, options: ChatOptions = { model: 'chatgpt' }) => {
    if (!content.trim()) return;

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log(`Sending prompt to ${options.model} API:`, content);
      let result;
      
      if (options.model === 'gemini') {
        result = await client.queries.promptGemini({ 
          prompt: content, 
          useGrounding: options.useGrounding || false 
        });
      } else {
        result = await client.queries.promptGpt({ prompt: content });
      }
      
      console.log('API result:', result);
      
      if (result.errors && result.errors.length > 0) {
        console.error("GraphQL errors:", result.errors);
        const errorMessage: Message = { 
          role: 'assistant', 
          content: `Error: ${result.errors[0].message}` 
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      const assistantText = result.data ?? "";
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: assistantText,
        model: options.model 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("promptGpt error:", err);
      let errorText = "Error fetching GPT response.";
      
      if (err.message) {
        errorText = `Error: ${err.message}`;
      } else if (err.errors && err.errors.length > 0) {
        errorText = `Error: ${err.errors[0].message}`;
      }
      
      const errorMessage: Message = { role: 'assistant', content: errorText };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
} 