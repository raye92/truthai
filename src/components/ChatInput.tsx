import { FormEvent, useState } from "react";
import { MessageInput } from './MessageInput';
import { SubmitButton } from './SubmitButton';
import type { ChatOptions } from "../hooks/useChat";

interface ChatInputProps {
  onSendMessage: (message: string, options: ChatOptions) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  type SelectedModel = 'chatgpt' | 'gemini' | 'gemini_grounding';
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<SelectedModel>("chatgpt");

  const handleSubmit = (e?: FormEvent | null) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const baseModel: ChatOptions['model'] = selectedModel.startsWith('gemini') ? 'gemini' : 'chatgpt';

    const options: ChatOptions = {
      model: baseModel,
      useGrounding: selectedModel === 'gemini_grounding' ? true : undefined
    };

    onSendMessage(input, options);
    setInput("");
  };

  const getModelSelectStyle = () => {
    const baseStyle = { ...styles.modelSelect };
    if (isLoading) {
      return {
        ...baseStyle,
        background: '#1e293b',
        cursor: 'not-allowed',
      };
    }
    return baseStyle;
  };

  return (
    <div style={styles.chatInputContainer}>
      <form onSubmit={handleSubmit} style={styles.chatInputForm}>
        <MessageInput
          value={input}
          onChange={setInput}
          placeholder="Type your message..."
          disabled={isLoading}
          isLoading={isLoading}
          onEnterPress={() => handleSubmit(null)}
        />
        
        <div style={styles.modelSelector}>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value as SelectedModel)}
            disabled={isLoading}
            style={getModelSelectStyle()}
            onFocus={(e) => {
              e.target.style.outline = 'none';
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="chatgpt">ChatGPT</option>
            <option value="gemini">Gemini</option>
            <option value="gemini_grounding" title="Gemini + Google Search">Gemini + Google Search</option>
          </select>
        </div>
        
        <SubmitButton
          type="submit"
          label="Send"
          isInvalid={!input.trim()}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </form>
    </div>
  );
}

const styles = {
  chatInputContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    padding: '16px 16px',
  },
  chatInputForm: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  modelSelector: {
    display: 'flex',
    alignItems: 'center',
  },
  modelSelect: {
    padding: '0.75rem',
    border: '1px solid #475569',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    background: '#1e293b',
    color: '#e2e8f0',
    cursor: 'pointer',
    width: '125px',
    height: '48px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
