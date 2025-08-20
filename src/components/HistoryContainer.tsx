import React from 'react';
import { useChatStore } from '../api/chat/chatStore';
import { getCurrentUser } from '@aws-amplify/auth';

export const HistoryContainer: React.FC = () => {
  const conversations = useChatStore((state) => state.conversations);
  const currentConversation = useChatStore((state) => state.currentConversation);
  const setCurrentConversation = useChatStore((state) => state.setCurrentConversation);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    getCurrentUser().then(user => setIsAuthenticated(!!user.userId));
  }, []);

  return (
    <div className="history-container">
      <div className="history-list">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <button
              type="button"
              key={conv.conversationId}
              className={`history-item${
                currentConversation?.conversationId === conv.conversationId ? ' selected' : ''
              }`}
              onClick={() => setCurrentConversation(conv)}
            >
              <span className="history-title">{conv.title || 'Untitled conversation'}</span>
              <span className="history-timestamp">{conv.messages.length} message{conv.messages.length === 1 ? '' : 's'}</span>
            </button>
          ))
        ) : (
          <div className="history-empty">
            {isAuthenticated ? (
              <>
                <p>No chat history yet</p>
                <p> -</p>
                <p>Unsaved chats will be deleted after 1 week</p> {/* ======== IMPLEMENT ======== */}
              </>
            ) : (
              <p>Sign in to save your history</p>
            )}
          </div>
        )}
      </div>
      <style>{styles}</style>
    </div>
  );
};

const styles = `
  .history-container {
    margin: 1.5rem 0;
    padding: 1rem 0;
    border-top: 1px solid #374151;
    border-bottom: 1px solid #374151;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .history-item {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0.75rem;
    background: #374151;
    border: 1px solid #4b5563;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .history-item:hover {
    background: #4b5563;
    border-color: #6b7280;
  }

  .history-item.selected {
    background: #3b82f6;
    border-color: #2563eb;
  }

  .history-title {
    color: #d1d5db;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  .history-timestamp {
    color: #9ca3af;
    font-size: 0.75rem;
    font-weight: 400;
  }

  .history-empty {
    text-align: center;
    padding: 1rem;
  }

  .history-empty p {
    color: #9ca3af;
    font-size: 0.875rem;
    margin: 0;
    font-style: italic;
  }
`;
