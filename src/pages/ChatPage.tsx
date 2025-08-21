import { useEffect, useRef, useState, useMemo } from 'react';
import { MessageBubble } from "../components/MessageBubble";
import { useChat } from "../hooks/useChat";
import { Logo } from "../assets/Icons";
import { MessageInput } from "../components/Input";
import { useChatStore } from "../api/chat/chatStore";
import { ChatLogic } from "../api/chat/chatLogic";

export function ChatPage() {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState("");
  type SelectedModel = 'chatgpt' | 'gemini' | 'gemini_grounding';
  const [selectedModel, setSelectedModel] = useState<SelectedModel>('chatgpt');

  const currentConversationId = useChatStore((s) => s.currentConversationId);
  const conversations = useChatStore((s) => s.conversations);
  const currentConversation = useMemo(() => conversations.find(c => c.conversationId === currentConversationId) || null, [conversations, currentConversationId]);

  const storeMessages = currentConversation?.messages || [];
  const viewMessages = currentConversation
    ? storeMessages.map(m => ({ role: m.role, content: m.content, model: m.metadata?.provider === 'gemini' ? 'gemini' : 'chatgpt' }))
    : messages;

  // Minimal scroll handling
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Newest at bottom by reversing for render
  const renderMessages = [...viewMessages].reverse();

  useEffect(() => { // auto scroll to bottom on new load
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [renderMessages.length, currentConversationId]);

  const handleContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!currentConversationId || isFetchingMore) return;
    const el = e.currentTarget;
    const canScroll = el.scrollHeight > el.clientHeight + 10;
    if (!canScroll) return;
    if (el.scrollTop <= 10) {
      setIsFetchingMore(true);
      ChatLogic.loadMessages(currentConversationId)
        .catch(console.error)
        .finally(() => setIsFetchingMore(false));
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const baseModel = selectedModel.startsWith('gemini') ? 'gemini' : 'chatgpt';
    sendMessage(input, { model: baseModel, useGrounding: selectedModel === 'gemini_grounding' ? true : undefined });
    setInput("");
  };

  return (
    <div style={styles.chatPage}>
      <div style={styles.messagesContainer} ref={containerRef} onScroll={handleContainerScroll}>
        {renderMessages.length === 0 && (
          <div style={styles.emptyState}>
            <h1 style={styles.chatLogoTitle}>CurateAI</h1>
            <p style={styles.emptyStateP}>
              Ask a question and get curated answers from multiple AI models
            </p>
          </div>
        )}
        {renderMessages.map((message, idx) => (
          <MessageBubble key={idx} message={message} />
        ))}
        {isLoading && (
          <div style={styles.loadingIndicator}>
            <span style={styles.loadingLogo}>
              <Logo
                width={24}
                height={24}
                fill="#94a3b8"
              />
            </span>
            <span style={styles.loadingIndicatorSpan}>Aggregating responses from multiple LLMs...</span>
          </div>
        )}
      </div>

      <div style={styles.inputBarWrapper}>
        <MessageInput
          value={input}
          onChange={setInput}
          placeholder="Type your message..."
          disabled={isLoading}
          isLoading={isLoading}
          onEnterPress={handleSend}
          showModelSelect
          model={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>
    </div>
  );
}

const styles = {
  chatPage: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '2rem',
    background: '#0f172a',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center' as const,
  },
  chatLogoTitle: {
    color: '#e2e8f0',
    textShadow: 'none',
    margin: '0 0 20px 0',
    fontSize: '2.5rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  emptyStateP: {
    margin: 0,
    fontSize: '1.125rem',
    maxWidth: '400px',
  },
  loadingIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start' as const,
    margin: '1rem 0',
  },
  loadingIndicatorSpan: {
    color: '#94a3b8',
    fontStyle: 'italic',
    marginLeft: '10px',
  },
  loadingLogo: {
    animation: 'pulse 1.5s infinite ease-in-out',
  },
  inputBarWrapper: {
    padding: '16px 16px',
    background: '#0f172a',
  },
};
