import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChatInput } from "./components/ChatInput";
import { MessageBubble } from "./components/MessageBubble";
import { useChat } from "./hooks/useChat";
import { Logo } from "./assets/Logo";
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
        <Logo width={80} height={80} fill="white" />
      </button>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
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
              <Logo width={24} height={24} fill="#000000ff" className="loading-logo" />
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
