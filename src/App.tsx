import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { useChat } from './hooks/useChat';
import { Ticker } from './components/Ticker';
import { Sidebar } from './components/Sidebar';

export default function App() {
  const { user, signOut } = useAuthenticator();
  const { messages, isLoading, sendMessage } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar onSignOut={signOut} onToggle={setIsSidebarOpen} />
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <h1>{user?.signInDetails?.loginId}'s TruthAI Chat</h1>

        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />

        {/* <Ticker text="Welcome to TruthAI! This is a ticker example using framer-motion." /> */}
      </main>
    </>
  );
}
