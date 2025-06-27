import { useAuthenticator } from '@aws-amplify/ui-react';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { useChat } from './hooks/useChat';
import { Ticker } from './components/Ticker';

export default function App() {
  const { user, signOut } = useAuthenticator();
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>{user?.signInDetails?.loginId}'s TruthAI Chat</h1>

      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />

      <Ticker text="Welcome to TruthAI! This is a ticker example using framer-motion." />

      <button 
        onClick={signOut} 
        style={{ marginTop: 24 }}
      >
        Sign out
      </button>
    </main>
  );
}
