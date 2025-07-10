import { Message } from "../hooks/useChat";
import "./MessageBubble.css";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`message-container ${message.role}`}>
      <div className="message-bubble">{message.content}</div>
    </div>
  );
}
