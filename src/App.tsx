import { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChatInput } from "./components/ChatInput";
import { MessageBubble } from "./components/MessageBubble";
import { SignInModal } from "./components/SignInModal";
import { useChat } from "./hooks/useChat";
import { Logo } from "./assets/Logo";
import "./App.css";
import { Quiz as QuizType, Question as QuizQuestion, Answer as QuizAnswer } from "./components/Quiz/types";
import { generateSampleProviders } from "./components/Quiz/ProviderCard";

export default function App() {
  const { user, signOut, authStatus } = useAuthenticator();
  const { messages, isLoading, sendMessage } = useChat();
  // Quiz state
  const [quiz, setQuiz] = useState<QuizType>({ questions: [] });
  // Track the last user prompt to pair with the next assistant answer
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  // Local chat messages with quiz message injection
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  // Helper to add or update a question/answer in the quiz
  function handleQuizUpdate(role: 'user' | 'assistant', content: string) {
    if (role === 'user') {
      setLastPrompt(content);
      setQuiz(prevQuiz => {
        const existingQuestion = prevQuiz.questions.find(q => q.text === content);
        if (existingQuestion) return prevQuiz;
        return {
          ...prevQuiz,
          questions: [
            ...prevQuiz.questions,
            { text: content, answers: [], totalProviders: 0 }
          ]
        };
      });
    } else if (role === 'assistant' && lastPrompt) {
      setQuiz(prevQuiz => {
        const questionIdx = prevQuiz.questions.findIndex(q => q.text === lastPrompt);
        if (questionIdx === -1) return prevQuiz;
        const question = prevQuiz.questions[questionIdx];
        const answerIdx = question.answers.findIndex(a => a.answer === content);
        let newAnswers: QuizAnswer[];
        let newTotalProviders = question.totalProviders;
        let newAnswer: QuizAnswer;
        const allProviders = generateSampleProviders(10);
        const randomProvider = allProviders[Math.floor(Math.random() * allProviders.length)];
        if (answerIdx !== -1) {
          const answer = question.answers[answerIdx];
          const alreadyHas = answer.providers.some(p => p.name === randomProvider.name);
          const updatedProviders = alreadyHas ? [...answer.providers] : [...answer.providers, randomProvider];
          newAnswer = { ...answer, providers: updatedProviders };
          newAnswers = question.answers.map((a, i) => i === answerIdx ? newAnswer : a);
          if (!alreadyHas) newTotalProviders += 1;
        } else {
          newAnswer = { answer: content, providers: [randomProvider] };
          newAnswers = [...question.answers, newAnswer];
          newTotalProviders += 1;
        }
        const newQuestion: QuizQuestion = {
          ...question,
          answers: newAnswers,
          totalProviders: newTotalProviders
        };
        const newQuestions = prevQuiz.questions.map((q, i) => i === questionIdx ? newQuestion : q);
        return { ...prevQuiz, questions: newQuestions };
      });
      setLastPrompt(null);
    }
  }

  // Listen for new messages and update quiz state and chatMessages
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    handleQuizUpdate(lastMsg.role, lastMsg.content);
    // Build chatMessages: inject quiz after each assistant message
    let quizMsgInjected = false;
    const newChatMessages = messages.flatMap((msg, idx) => {
      if (msg.role === 'assistant') {
        quizMsgInjected = true;
        return [msg, { role: 'assistant', type: 'quiz', quizData: quiz }];
      }
      return [msg];
    });
    // If no assistant yet, no quiz message
    setChatMessages(newChatMessages);
    // eslint-disable-next-line
  }, [messages, quiz]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

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
        <div className="messages-container">
          {chatMessages.length === 0 && (
            <div className="empty-state">
              <h1 className="auth-logo-title">CurateAI</h1>
              <p>
                Ask a question and get curated answers from multiple AI models
              </p>
            </div>
          )}
          {chatMessages.map((message, idx) => (
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
      </main>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />
    </div>
  );
}
