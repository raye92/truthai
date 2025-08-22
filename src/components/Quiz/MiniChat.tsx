import { useState, useEffect, useMemo, useRef } from 'react';
import { MessageBubble } from '../MessageBubble';
import { useChat } from '../../hooks/useChat';
// Replacing heavy MessageInput with lightweight inline input to avoid loading flicker
import { FullscreenIcon } from '../../assets/Icons';
import { useChatStore } from '../../api/chat/chatStore';

interface MiniChatProps {
  providerName: string;
  questionText: string;
  answerText: string;
  isOpen: boolean;
  onClose: () => void;
  onFullScreen: () => void;
}

// Provider -> internal model mapping
function mapProvider(provider: string): { model: 'chatgpt' | 'gemini'; grounding?: boolean } {
  if (provider.includes('Gemini') && provider.includes('Google')) return { model: 'gemini', grounding: true };
  if (provider.includes('Gemini')) return { model: 'gemini' };
  return { model: 'chatgpt' };
}

export function MiniChat({ providerName, answerText, isOpen, onClose, onFullScreen }: MiniChatProps) {
  const { isLoading, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const hasSentInitial = useRef(false);

  // Pull current conversation messages from store (like ChatPage)
  const currentConversationId = useChatStore(s => s.currentConversationId);
  const conversations = useChatStore(s => s.conversations);
  const currentConversation = useMemo(() => conversations.find(c => c.conversationId === currentConversationId) || null, [conversations, currentConversationId]);
  const storeMessages = currentConversation?.messages || [];
  const viewMessages = storeMessages.map(m => ({ role: m.role, content: m.content, model: m.metadata?.provider === 'gemini' ? 'gemini' : 'chatgpt' }));
  const renderMessages = [...viewMessages].reverse(); // newest bottom

  // Auto send concise explanation once when opened
  useEffect(() => {
    if (!isOpen || hasSentInitial.current) return;
    const { model, grounding } = mapProvider(providerName);
    const prompt = `Explain concisely why this answer is correct: "${answerText}"`;
    hasSentInitial.current = true;
    sendMessage(prompt, { model, useGrounding: grounding });
  }, [isOpen, providerName, answerText, sendMessage]);

  // Scroll to bottom on new message
  const msgRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = msgRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [renderMessages.length, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const { model, grounding } = mapProvider(providerName);
    setSending(true);
    await sendMessage(input, { model, useGrounding: grounding });
    setInput('');
    setSending(false);
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
          <button onClick={onFullScreen} style={styles.miniChatButton} title="Open in full screen">
            <FullscreenIcon width={16} height={16} fill="#94a3b8" />
            <span style={styles.ExpandLabel}>Full Screen</span>
          </button>
          <button onClick={onClose} style={styles.miniChatButton} title="Close mini chat">×</button>
        </div>
      </div>

      <div style={styles.miniChatMessages} ref={msgRef}>
        {renderMessages.map((m, i) => <MessageBubble key={i} message={m} />)}
        {isLoading && (
          <div style={styles.miniChatLoading}>
            <span style={styles.miniChatLoadingText}>Thinking...</span>
          </div>
        )}
      </div>

      <div style={styles.miniChatInput}>
        <div style={styles.inlineInputContainer}>
          <textarea
            value={input}
            placeholder={`Ask ${providerName}...`}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            rows={1}
            style={styles.inlineTextarea as any}
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            style={{ ...styles.inlineSendButton, ...(sending || !input.trim() ? styles.inlineSendButtonDisabled : {}) }}
          >{sending ? 'Sending...' : 'Send'}</button>
        </div>
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
    maxHeight: '500px',
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
    flexShrink: 0,
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
    minHeight: '200px',
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
    flexShrink: 0,
  },
  inlineInputContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '0.5rem',
  },
  inlineTextarea: {
    flex: 1,
    background: '#1e293b',
    border: '1px solid #475569',
    borderRadius: '0.5rem',
    padding: '0.6rem 0.75rem',
    resize: 'none' as const,
    fontSize: '0.9rem',
    lineHeight: '1.25rem',
    color: '#e2e8f0',
    fontFamily: 'inherit',
    maxHeight: '120px',
    outline: 'none',
  },
  inlineSendButton: {
    background: '#3b82f6',
    color: '#e2e8f0',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0 1rem',
    height: '42px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  inlineSendButtonDisabled: {
    background: '#475569',
    cursor: 'not-allowed',
  },
};

// CSS animation is handled in the component styles
