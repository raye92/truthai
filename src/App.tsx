import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { SignInModal } from "./components/SignInModal";
import { ChatPage } from "./pages/ChatPage";
import { QuizPage } from "./pages/quiz";
import TutorialPage from "./pages/TutorialPage";
import { Logo, ChatIcon, QuestionMarkIcon } from "./assets/Icons";
import { HistoryContainer } from "./components/HistoryContainer";
import { ChatLogic } from "./api/chat/chatLogic";
import { useChatStore } from "./api/chat/chatStore";
import "./App.css";

export default function App() {
  const { user, signOut, authStatus } = useAuthenticator();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const location = useLocation();
  const setCurrentConversationId = useChatStore((s) => s.setCurrentConversationId);

  // Load conversations when user is authenticated
  useEffect(() => {
    if (authStatus === "authenticated") {
      ChatLogic.loadConversations();
    }
  }, [authStatus]);

  const handleSignOut = async () => {
    try {
      console.log("Current authStatus before signOut:", authStatus);
      await signOut();
      console.log("Current authStatus after signOut:", authStatus);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="app-container">
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <Logo width={80} height={80} fill="#e2e8f0" />
      </button>

      {/* Sign In Button for unauthenticated users */}
      {authStatus !== "authenticated" && (
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

          <nav className="sidebar-nav">
            <Link
              to="/"
              className={`nav-link`}
              onClick={() => setSidebarOpen(false)}
            >
              <Logo width={20} height={20} fill="currentColor" />
              Curate Mode
            </Link>
            <Link
              to="/chat"
              className={`nav-link`}
              onClick={() => { setCurrentConversationId(null); setSidebarOpen(false); }}
            >
              <ChatIcon width={20} height={20} fill="currentColor" />
              Chat
            </Link>
            <Link
              to="/tutorial"
              className={`nav-link`}
              onClick={() => setSidebarOpen(false)}
            >
              <QuestionMarkIcon width={16} height={16} fill="currentColor" />
              How To
            </Link>
          </nav>
        </div>

        <HistoryContainer isAuthenticated={authStatus === "authenticated"} onSelectChat={() => setSidebarOpen(false)} />

        <div className="sidebar-footer">
          {authStatus === "authenticated" ? (
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

      <main className="main-content">
        <Routes>
          <Route path="/" element={<QuizPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:conversationId" element={<ChatPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/tutorial" element={<TutorialPage />} />
        </Routes>
      </main>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />
    </div>
  );
}
