import { ChatInput } from "../components/ChatInput";
import { MessageBubble } from "../components/MessageBubble";
import { useChat } from "../hooks/useChat";
import { Logo } from "../assets/Icons";

export function ChatPage() {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div style={styles.chatPage}>
      <div style={styles.messagesContainer}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <h1 style={styles.chatLogoTitle}>CurateAI</h1>
            <p style={styles.emptyStateP}>
              Ask a question and get curated answers from multiple AI models
            </p>
          </div>
        )}
        {messages.map((message, idx) => (
          <MessageBubble key={idx} message={message} />
        ))}
        {isLoading && (
          <div style={styles.loadingIndicator}>
            <span style={styles.loadingLogo}>
              <Logo
                width={24}
                height={24}
                fill="#f9fafb"
              />
            </span>
            <span style={styles.loadingIndicatorSpan}>Aggregating responses from multiple LLMs...</span>
          </div>
        )}
      </div>

      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
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
    background: '#111827',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center' as const,
  },
  chatLogoTitle: {
    color: '#f9fafb',
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
    color: '#9ca3af',
    fontStyle: 'italic',
    marginLeft: '10px',
  },
  loadingLogo: {
    animation: 'pulse 1.5s infinite ease-in-out',
  },
};
