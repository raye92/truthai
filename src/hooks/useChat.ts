import { useState } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await client.queries.promptGpt({ prompt: content });
      const assistantText = result.data ?? "";
      const assistantMessage: Message = { role: 'assistant', content: assistantText };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error("promptGpt error:", err);
      const errorMessage: Message = { role: 'assistant', content: "Error fetching GPT response." };
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