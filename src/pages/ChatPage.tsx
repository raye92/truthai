import { ChatInput } from "../components/ChatInput";
import { MessageBubble } from "../components/MessageBubble";
import { useChat } from "../hooks/useChat";
import { Logo } from "../assets/Icons";
import './ChatPage.css';

export function ChatPage() {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div className="chat-page">
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <h1 className="chat-logo-title">CurateAI</h1>
            <p>
              Ask a question and get curated answers from multiple AI models
            </p>
          </div>
        )}
        {messages.map((message, idx) => (
          <MessageBubble key={idx} message={message} />
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <Logo
              width={24}
              height={24}
              fill="#000000ff"
              className="loading-logo"
            />
            <span>Aggregating responses from multiple LLMs...</span>
          </div>
        )}
      </div>

      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
