import { useState } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { SignInModal } from "./components/SignInModal";
import { ChatPage } from "./pages/ChatPage";
import { QuizPage } from "./pages/QuizPage";
import { Logo } from "./assets/Logo";
import "./App.css";

export default function App() {
  const { user, signOut, authStatus } = useAuthenticator();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const location = useLocation();

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

          <nav className="sidebar-nav">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              💬 Chat
            </Link>
            <Link
              to="/quiz"
              className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              🧠 Quiz Mode
            </Link>
          </nav>
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

      <main className="main-content">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/quiz" element={<QuizPage />} />
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
