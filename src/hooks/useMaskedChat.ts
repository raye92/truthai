import { useState, useRef } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { ChatLogic } from '../api/chat/chatLogic';

const client = generateClient<Schema>({ authMode: 'apiKey' });

export type ModelType = 'chatgpt' | 'gemini';
interface ChatOptions { model: ModelType; useGrounding?: boolean; }

// Provides ability to send hardcoded instructions with user message 
export function useMaskedChat() {
  const [isLoading, setIsLoading] = useState(false);
  const conversationIdRef = useRef<string | null>(null);
  const getConversation = async () => {
    if (conversationIdRef.current) return conversationIdRef.current;
    const id = await ChatLogic.createConversation('Explain');
    conversationIdRef.current = id;
    return id;
  };

  const runModel = async (prompt: string, options: ChatOptions) => {
    return options.model === 'gemini'
      ? await client.queries.promptGemini({ prompt, useGrounding: options.useGrounding || false })
      : await client.queries.promptGpt({ prompt });
  };

  const coreSend = async (userContent: string, modelPrompt: string | null, options: ChatOptions, maskUser: boolean) => {
    if (!userContent.trim()) return '';
    const convId = await getConversation();
    // If masked, display userContent but send modelPrompt; else both identical
    await ChatLogic.addMessage(convId, 'user', userContent, options.model, options.model);
    setIsLoading(true);
    try {
      const result = await runModel(modelPrompt ?? userContent, options);
      const assistantText = result.errors?.length ? `Error: ${result.errors[0].message}` : (result.data ?? '');
      await ChatLogic.addMessage(convId, 'assistant', assistantText, options.model, options.model);
      return assistantText;
    } catch (e: any) {
      const errText = e?.message ? `Error: ${e.message}` : 'Error fetching response.';
      await ChatLogic.addMessage(convId, 'assistant', errText, options.model, options.model);
      return '';
    } finally { setIsLoading(false); }
  };

  const sendMessage = (content: string, options: ChatOptions) => coreSend(content, null, options, false);
  const sendMasked = (displayText: string, backendPrompt: string, options: ChatOptions) => coreSend(displayText, backendPrompt, options, true);

  return { isLoading, sendMessage, sendMasked };
}
