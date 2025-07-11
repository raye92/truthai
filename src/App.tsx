import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChatInput } from "./components/ChatInput";
import { MessageBubble } from "./components/MessageBubble";
import { useChat } from "./hooks/useChat";
import "./App.css";

export default function App() {
  const { user, signOut } = useAuthenticator();
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <svg
              className="logo"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Multiple interconnected circles representing different LLMs */}
              <circle cx="12" cy="12" r="8" fill="#3b82f6" opacity="0.7" />
              <circle cx="28" cy="12" r="8" fill="#8b5cf6" opacity="0.7" />
              <circle cx="12" cy="28" r="8" fill="#10b981" opacity="0.7" />
              <circle cx="28" cy="28" r="8" fill="#f59e0b" opacity="0.7" />

              {/* Central aggregation point */}
              <circle cx="20" cy="20" r="6" fill="#1f2937" opacity="0.9" />

              {/* Connection lines showing data flow */}
              <line
                x1="12"
                y1="12"
                x2="20"
                y2="20"
                stroke="#6b7280"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="28"
                y1="12"
                x2="20"
                y2="20"
                stroke="#6b7280"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="12"
                y1="28"
                x2="20"
                y2="20"
                stroke="#6b7280"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="28"
                y1="28"
                x2="20"
                y2="20"
                stroke="#6b7280"
                strokeWidth="2"
                opacity="0.6"
              />
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
