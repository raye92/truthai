import { Message } from "../hooks/useChat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const containerStyle = {
    ...styles.messageContainer,
    ...(message.role === 'user' ? styles.messageContainerUser : styles.messageContainerAssistant)
  };

  const bubbleStyle = {
    ...styles.messageBubble,
    ...(message.role === 'user' ? styles.userMessageBubble : styles.assistantMessageBubble)
  };

  return (
    <div style={containerStyle}>
      <div style={bubbleStyle}>
        {message.role === 'assistant' && message.model && (
          <div style={styles.modelBadge}>
            {message.model === 'gemini' ? 'Gemini' : 'ChatGPT'}
          </div>
        )}
        <div style={styles.messageContent}>{message.content}</div>
      </div>
    </div>
  );
}

const styles = {
  messageContainer: {
    marginBottom: '1.5rem',
    display: 'flex',
  },
  messageContainerUser: {
    justifyContent: 'flex-end' as const,
  },
  messageContainerAssistant: {
    justifyContent: 'flex-start' as const,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '0.75rem 1rem',
    borderRadius: '1rem',
    lineHeight: 1.5,
    wordBreak: 'break-word' as const,
    position: 'relative' as const,
  },
  modelBadge: {
    fontSize: '0.75rem',
    background: '#334155',
    color: '#cbd5e1',
    padding: '0.125rem 0.5rem',
    borderRadius: '0.25rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    display: 'inline-block',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
  },
  messageContent: {
    lineHeight: 1.5,
  },
  userMessageBubble: {
    background: '#3b82f6',
    color: 'white',
    borderBottomRightRadius: '0.25rem',
  },
  assistantMessageBubble: {
    background: '#1e293b',
    color: '#e2e8f0',
    border: '1px solid #475569',
    borderBottomLeftRadius: '0.25rem',
  },
};
