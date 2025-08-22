import { useState } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { ChatLogic } from "../api/chat/chatLogic";
import { useChatStore } from "../api/chat/chatStore";

const client = generateClient<Schema>({ authMode: 'apiKey' });

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

  const sendMessage = async (content: string, options: ChatOptions = { model: 'chatgpt' }): Promise<string> => {
    if (!content.trim()) return '';

    // Ensure a conversation exists; create on new chat
    let convId = useChatStore.getState().currentConversationId || undefined;
    if (!convId) {
      convId = await ChatLogic.createConversation('Chat');
    }
    await ChatLogic.addMessage(convId as string, 'user', content, options.model, options.model);
    
    setIsLoading(true);
    try {
      const result = options.model === 'gemini'
        ? await client.queries.promptGemini({ prompt: content, useGrounding: options.useGrounding || false })
        : await client.queries.promptGpt({ prompt: content });

      const assistantText = result.errors?.length ? `Error: ${result.errors[0].message}` : (result.data ?? '');
      await ChatLogic.addMessage(convId as string, 'assistant', assistantText, options.model, options.model);
      return assistantText;
    } catch (err: any) {
      const errText = err?.message ? `Error: ${err.message}` : 'Error fetching response.';
      await ChatLogic.addMessage(convId as string, 'assistant', errText, options.model, options.model);
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
}