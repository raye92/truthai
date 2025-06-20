import { Message } from '../hooks/useChat';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div style={{ marginBottom: 12, textAlign: message.role === 'user' ? 'right' : 'left' }}>
      <span
        style={{
          display: 'inline-block',
          padding: '8px 12px',
          borderRadius: 16,
          background: message.role === 'user' ? '#DCF8C6' : '#F1F0F0',
        }}
      >
        {message.content}
      </span>
    </div>
  );
} 