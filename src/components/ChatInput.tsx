import { FormEvent, useState } from "react";
import type { ChatOptions } from "../hooks/useChat";

interface ChatInputProps {
  onSendMessage: (message: string, options: ChatOptions) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<"chatgpt" | "gemini">("chatgpt");
  const [useGrounding, setUseGrounding] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const options: ChatOptions = {
      model: selectedModel,
      useGrounding: selectedModel === "gemini" ? useGrounding : undefined
    };

    onSendMessage(input, options);
    setInput("");
  };

  const getInputStyle = () => {
    const baseStyle = { ...styles.chatInput };
    if (isLoading) {
      return {
        ...baseStyle,
        background: '#2d3748',
        color: '#6b7280',
      };
    }
    return baseStyle;
  };

  const getModelSelectStyle = () => {
    const baseStyle = { ...styles.modelSelect };
    if (isLoading) {
      return {
        ...baseStyle,
        background: '#2d3748',
        cursor: 'not-allowed',
      };
    }
    return baseStyle;
  };

  const getSendButtonStyle = () => {
    const baseStyle = { ...styles.sendButton };
    if (isLoading || !input.trim()) {
      return {
        ...baseStyle,
        background: '#d1d5db',
        cursor: 'not-allowed',
      };
    }
    return baseStyle;
  };

  const getCheckboxStyle = () => {
    if (isLoading) {
      return {
        cursor: 'not-allowed',
      };
    }
    return {
      cursor: 'pointer',
    };
  };

  return (
    <div style={styles.chatInputContainer}>
      {selectedModel === "gemini" && (
        <div style={styles.groundingOptionTop}>
          <label style={styles.groundingLabel}>
            <input
              type="checkbox"
              checked={useGrounding}
              onChange={(e) => setUseGrounding(e.target.checked)}
              disabled={isLoading}
              style={getCheckboxStyle()}
            />
            Google Search Grounding
          </label>
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={styles.chatInputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={getInputStyle()}
          disabled={isLoading}
          onFocus={(e) => {
            e.target.style.outline = 'none';
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#4b5563';
            e.target.style.boxShadow = 'none';
          }}
        />
        
        <div style={styles.modelSelector}>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value as "chatgpt" | "gemini")}
            disabled={isLoading}
            style={getModelSelectStyle()}
            onFocus={(e) => {
              e.target.style.outline = 'none';
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#4b5563';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="chatgpt">ChatGPT</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={getSendButtonStyle()}
          onMouseEnter={(e) => {
            if (!isLoading && input.trim()) {
              e.currentTarget.style.background = '#2563eb';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && input.trim()) {
              e.currentTarget.style.background = '#3b82f6';
            }
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  chatInputContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    padding: '0px 10px',
  },
  groundingOptionTop: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '0.5rem 0',
  },
  groundingLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: '0.875rem',
    color: '#d1d5db',
    cursor: 'pointer',
  },
  chatInputForm: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '1px solid #4b5563',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    background: '#374151',
    color: '#f9fafb',
    transition: 'border-color 0.2s',
  },
  modelSelector: {
    display: 'flex',
    alignItems: 'center',
  },
  modelSelect: {
    padding: '0.75rem',
    border: '1px solid #4b5563',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    background: '#374151',
    color: '#f9fafb',
    cursor: 'pointer',
    minWidth: '100px',
  },
  sendButton: {
    padding: '0.75rem 1.5rem',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
