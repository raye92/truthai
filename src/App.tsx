import { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChatInput } from "./components/ChatInput";
import { MessageBubble } from "./components/MessageBubble";
import { SignInModal } from "./components/SignInModal";
import { useChat } from "./hooks/useChat";
import { Logo } from "./assets/Logo";
import { ComponentDemo } from "./pages/ComponentDemo"; // ======== TESTING =========
import "./App.css";
type AppPage = 'chat' | 'demo';// ======== TESTING =========


export default function App() {
  const { user, signOut, authStatus } = useAuthenticator();
  const { messages, isLoading, sendMessage } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('chat');// ======== TESTING =========

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isAuthenticated = authStatus === "authenticated";

  return (
    <div className="app-container">
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <Logo width={80} height={80} fill="white" />
      </button>

      {/* Sign In Button for unauthenticated users */}
      {!isAuthenticated && (
        <button
          className="sign-in-button"
          onClick={() => setSignInModalOpen(true)}
        >
          Sign In
        </button>
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="app-title">
            <h1>CurateAI</h1>
            <p>Multi-LLM Aggregator</p>
          </div>
          <div className="navigation-menu">
            <button 
              className={`nav-button ${currentPage === 'chat' ? 'active' : ''}`}
              onClick={() => setCurrentPage('chat')}
            >
              💬 Chat
            </button>
            <button 
              className={`nav-button ${currentPage === 'demo' ? 'active' : ''}`}
              onClick={() => setCurrentPage('demo')}
            >
              🎯 Quiz Demo
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          {isAuthenticated ? (
            <div className="user-info">
              <p className="welcome-text">
                Welcome, {user?.signInDetails?.loginId || "User"}!
              </p>
              <button onClick={handleSignOut} className="sign-out-btn">
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSignInModalOpen(true)}
              className="sign-in-btn"
            >
              Sign In
            </button>
          )}
        </div>
      </aside>

      <main className="chat-main">
        {currentPage === 'chat' ? (
          <>
            <div className="messages-container">
              {messages.length === 0 && (
                <div className="empty-state">
                  <h1 className="auth-logo-title">CurateAI</h1>
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

            <div className="chat-input-container">
              <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
            </div>
          </>
        ) : (
          <ComponentDemo />
        )}
      </main>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />
    </div>
  );
}
