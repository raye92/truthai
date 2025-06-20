import { Message } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  return (
    <section style={{ 
      marginBottom: 16, 
      minHeight: 300, 
      border: '1px solid #ccc', 
      borderRadius: 8, 
      padding: 12, 
      overflowY: 'auto' 
    }}>
      {messages.map((message, idx) => (
        <MessageBubble key={idx} message={message} />
      ))}
      {isLoading && <div>Loading...</div>}
    </section>
  );
} 