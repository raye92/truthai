import { useState, useEffect } from 'react';
import { MessageBubble } from "../MessageBubble";
import { useChat } from "../../hooks/useChat";
import { MessageInput } from "../Input";
import { FullscreenIcon } from "../../assets/Icons";

interface MiniChatProps {
  providerName: string;
  questionText: string;
  answerText: string;
  isOpen: boolean;
  onClose: () => void;
  onFullScreen: () => void;
}

export function MiniChat({ providerName, questionText, answerText, isOpen, onClose, onFullScreen }: MiniChatProps) {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState("");

  // Map provider names to model types
  const getModelType = (provider: string) => {
    if (provider.includes('GPT') || provider.includes('OpenAI')) return 'chatgpt';
    if (provider.includes('Gemini')) return 'gemini';
    if (provider.includes('Google Search')) return 'gemini_grounding';
    return 'chatgpt';
  };

  const selectedModel = getModelType(providerName);

  // Auto-send initial question when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialQuestion = `Can you explain the answer "${answerText}" to the question: "${questionText}"?`;
      sendMessage(initialQuestion, { 
        model: selectedModel.startsWith('gemini') ? 'gemini' : 'chatgpt', 
        useGrounding: selectedModel === 'gemini_grounding' ? true : undefined 
      });
    }
  }, [isOpen, messages.length, answerText, questionText, selectedModel, sendMessage]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const baseModel = selectedModel.startsWith('gemini') ? 'gemini' : 'chatgpt';
    sendMessage(input, { 
      model: baseModel, 
      useGrounding: selectedModel === 'gemini_grounding' ? true : undefined 
    });
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div style={styles.miniChatContainer}>
      <div style={styles.miniChatHeader}>
        <div style={styles.miniChatTitle}>
          <span style={styles.miniChatProvider}>{providerName}</span>
          <span style={styles.miniChatSeparator}>•</span>
          <span style={styles.miniChatQuestion}>Mini Chat</span>
        </div>
        <div style={styles.miniChatActions}>
          <button 
            onClick={onFullScreen}
            style={styles.miniChatButton}
            title="Open in full screen"
          >
            <FullscreenIcon width={16} height={16} fill="#94a3b8" />
            <span style={styles.ExpandLabel}>Full Screen</span>
          </button>
          <button 
            onClick={onClose}
            style={styles.miniChatButton}
            title="Close mini chat"
          >
            ×
          </button>
        </div>
      </div>
      
      <div style={styles.miniChatMessages}>
        {messages.map((message, idx) => (
          <MessageBubble key={idx} message={message} />
        ))}
        {isLoading && (
          <div style={styles.miniChatLoading}>
            <span style={styles.miniChatLoadingText}>Thinking...</span>
          </div>
        )}
      </div>

      <div style={styles.miniChatInput}>
        <MessageInput
          value={input}
          onChange={setInput}
          placeholder={`Ask ${providerName}...`}
          disabled={isLoading}
          isLoading={isLoading}
          onEnterPress={handleSend}
          showModelSelect={false}
          model={selectedModel}
          onModelChange={() => {}}
        />
      </div>
    </div>
  );
}

const styles = {
  miniChatContainer: {
    position: 'absolute' as const,
    bottom: '0',
    left: '0',
    right: '0',
    background: '#1e293b',
    border: '1px solid #475569',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    zIndex: 1000,
    maxHeight: '400px',
    display: 'flex',
    flexDirection: 'column' as const,
    animation: 'slideDown 0.3s ease-out',
  },
  miniChatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #475569',
    background: '#334155',
    borderRadius: '0.75rem 0.75rem 0 0',
  },
  miniChatTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#e2e8f0',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  miniChatProvider: {
    color: '#3b82f6',
  },
  miniChatSeparator: {
    color: '#64748b',
  },
  miniChatQuestion: {
    color: '#94a3b8',
  },
  miniChatActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  miniChatButton: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  miniChatButtonHover: {
    background: '#475569',
    color: '#e2e8f0',
  },
  ExpandLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    letterSpacing: '0.025em',
  },
  miniChatMessages: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '0.75rem 1rem',
    maxHeight: '200px',
  },
  miniChatLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  miniChatLoadingText: {
    fontSize: '0.875rem',
  },
  miniChatInput: {
    padding: '0.75rem 1rem',
    borderTop: '1px solid #475569',
    background: '#334155',
    borderRadius: '0 0 0.75rem 0.75rem',
  },
};

// CSS animation is handled in the component styles
