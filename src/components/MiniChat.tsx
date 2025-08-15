import { useEffect, useState } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './Input';

interface MiniChatProps {
  providerLabel: string;
  initialModel: 'chatgpt' | 'gemini' | 'gemini_grounding';
  initialPrompt: string;
  onClose: () => void;
  onFullScreen: () => void;
}

export const MiniChat: React.FC<MiniChatProps> = ({ providerLabel, initialModel, initialPrompt, onClose, onFullScreen }) => {
  const { messages, isLoading, sendMessage } = useChat();
  const [hasSent, setHasSent] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!hasSent && initialPrompt) {
      const baseModel = initialModel.startsWith('gemini') ? 'gemini' : 'chatgpt';
      const useGrounding = initialModel === 'gemini_grounding';
      setHasSent(true);
      sendMessage(initialPrompt, { model: baseModel, useGrounding: useGrounding ? true : undefined });
    }
  }, [hasSent, initialPrompt, initialModel, sendMessage]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const baseModel = initialModel.startsWith('gemini') ? 'gemini' : 'chatgpt';
    const useGrounding = initialModel === 'gemini_grounding';
    sendMessage(input, { model: baseModel, useGrounding: useGrounding ? true : undefined });
    setInput('');
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.window} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>Chat • {providerLabel}</div>
          <div style={styles.spacer} />
          <button style={styles.fullBtn} onClick={onFullScreen}>Full Screen</button>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={styles.body}>
          <div style={styles.messages}>
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {isLoading && <div style={styles.loading}>Thinking…</div>}
          </div>
        </div>
        <div style={styles.footer}>
          <MessageInput
            value={input}
            onChange={setInput}
            disabled={isLoading}
            isLoading={isLoading}
            placeholder={`Message ${providerLabel}…`}
            onEnterPress={handleSend}
            showModelSelect
            model={initialModel}
            onModelChange={() => { /* model fixed per provider in mini chat */ }}
          />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  window: {
    width: 'min(720px, 92vw)',
    height: 'min(70vh, 560px)',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderBottom: '1px solid #334155',
    background: '#111827',
    color: '#e5e7eb',
  },
  title: { fontWeight: 600 },
  spacer: { flex: 1 },
  fullBtn: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '6px 10px',
    cursor: 'pointer',
  },
  closeBtn: {
    background: 'transparent',
    color: '#9ca3af',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    padding: '4px 8px',
  },
  body: { flex: 1, display: 'flex' },
  messages: { flex: 1, overflowY: 'auto', padding: 12 },
  loading: { color: '#9ca3af', fontStyle: 'italic' },
  footer: { padding: 12, borderTop: '1px solid #334155', background: '#0f172a' },
};
