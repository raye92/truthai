import { Message } from "../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import "./ChatWindow.css";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <div className="empty-state">
          <p>Start a conversation...</p>
        </div>
      )}
      {messages.map((message, idx) => (
        <MessageBubble key={idx} message={message} />
      ))}
      {isLoading && (
        <div className="loading-indicator">
          <span>Thinking...</span>
        </div>
      )}
    </div>
  );
}
