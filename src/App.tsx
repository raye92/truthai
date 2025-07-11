import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChatInput } from "./components/ChatInput";
import { MessageBubble } from "./components/MessageBubble";
import { useChat } from "./hooks/useChat";
import "./App.css";

export default function App() {
  const { user, signOut } = useAuthenticator();
  const { messages, isLoading, sendMessage } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg
          className="toggle-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12h18" />
          <path d="M3 6h18" />
          <path d="M3 18h18" />
        </svg>
      </button>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1024 1024"
  width="24"
  height="24"
  preserveAspectRatio="xMidYMid meet"
>
  <path d="M451 163.1c-28.4 3.6-59.1 16-82.2 33.1-45.2 33.5-69.4 90.3..." />
</svg>

          </div>
          <div className="app-title">
            <h1>CurateAI</h1>
            <p>Multi-LLM Aggregator</p>
          </div>
        </div>

        <div className="sidebar-footer">
          <button onClick={signOut} className="sign-out-btn">
            Sign out
          </button>
        </div>
      </aside>

      <main className="chat-main">
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="empty-state">
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
              <span>Aggregating responses from multiple LLMs...</span>
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
