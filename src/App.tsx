import { useAuthenticator } from "@aws-amplify/ui-react";
import { ChatWindow } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import { useChat } from "./hooks/useChat";
import "./App.css";

export default function App() {
  const { user, signOut } = useAuthenticator();
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Chat</h1>
        <button onClick={signOut} className="sign-out-btn">
          Sign out
        </button>
      </header>

      <main className="chat-main">
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}
