import { Message } from "../hooks/useChat";
import "./MessageBubble.css";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`message-container ${message.role}`}>
      <div className="message-bubble">
        {message.role === 'assistant' && message.model && (
          <div className="model-badge">
            {message.model === 'gemini' ? 'Gemini' : 'ChatGPT'}
          </div>
        )}
        <div className="message-content">{message.content}</div>
      </div>
    </div>
  );
}
