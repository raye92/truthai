import React from 'react';
import { useChatStore } from '../api/chat/chatStore';
import { ChatLogic } from '../api/chat/chatLogic';
import { useNavigate } from 'react-router-dom';

export const HistoryContainer: React.FC<{ isAuthenticated: boolean; onSelectChat?: () => void; }> = ({ isAuthenticated, onSelectChat }) => {
  const conversations = useChatStore((state) => state.conversations);
  const currentConversationId = useChatStore((state) => state.currentConversationId);
  const setCurrentConversationId = useChatStore((state) => state.setCurrentConversationId);
  const clearConversations = useChatStore((state) => state.clearConversations);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  // Clear conversations when user signs out
  React.useEffect(() => {
    if (!isAuthenticated) {
      clearConversations();
      setCurrentConversationId(null);
    }
  }, [isAuthenticated, clearConversations, setCurrentConversationId]);

  const handleScroll = React.useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Check if scrolled to bottom (with small threshold)
    if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading) {
      setIsLoading(true);
      try {
        await ChatLogic.loadConversations();
      } catch (error) {
        console.error('Error loading more conversations:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isLoading]);

  const handleSave = async (conversationId: string) => {
    // ======== IMPLEMENT SAVE ========
  };

  const handleDelete = async (conversationId: string) => {
    // ======== IMPLEMENT DELETE ========
  };

  return (
    <div className="history-container">
      <div className="history-list" onScroll={handleScroll}>
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <div key={conv.conversationId} className={`history-item-row${currentConversationId === conv.conversationId ? ' selected' : ''}`}>
              <button
                type="button"
                className={`history-item`}
                onClick={async () => {
                  setCurrentConversationId(conv.conversationId);
                  onSelectChat?.(); // close sidebar
                  navigate(`/chat/${conv.conversationId}`);
                  ChatLogic.loadMessages(conv.conversationId);
                }}
              >
                <span className="history-title">{conv.title || 'Untitled conversation'}</span>
                <span className="history-timestamp">{conv.messages.length} message{conv.messages.length === 1 ? '' : 's'}</span>
              </button>
              {conv.isSaved ? (
                <button
                  type="button"
                  className="history-action-btn"
                  title="Delete this chat"
                  aria-label="Delete chat"
                  onClick={() => handleDelete(conv.conversationId)}
                >
                  {/* Trash icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className="history-action-btn"
                  title="Save this chat"
                  aria-label="Save chat"
                  onClick={() => handleSave(conv.conversationId)}
                >
                  {/* Bookmark icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2h12a1 1 0 0 1 1 1v18l-7-4-7 4V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="history-empty">
            {isAuthenticated ? (
              <>
                <p>No chat history yet</p>
                <p> -</p>
                <p>Unsaved chats will be deleted after a while</p> {/* ======== IMPLEMENT ======== */}
              </>
            ) : (
              <p>Sign in to save your history</p>
            )}
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="history-loading">
            <div className="spinner"></div>
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
    max-height: 100%;
    overflow-y: auto;
  }

  .history-item-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0;
    align-items: stretch;
  }

  /* Selected state applies to both parts */
  .history-item-row.selected .history-item,
  .history-item-row.selected .history-action-btn {
    background: #3b82f6;
    border-color: #2563eb;
    color: #dbeafe;
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

  /* Hover the whole row affects both buttons */
  .history-item-row:hover .history-item,
  .history-item-row:hover .history-action-btn {
    background: #4b5563;
    border-color: #6b7280;
    color: #9ca3af;
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

  .history-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
    background: #374151;
    border: 1px solid #4b5563;
    border-radius: 0.375rem;
    color: #6b7280;
    transition: all 0.2s;
    height: 100%;
    align-self: stretch;
  }

  /* Visually connect history-item and action button when present */
  .history-item-row:has(.history-action-btn) .history-item {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
  }
  .history-item-row:has(.history-action-btn) .history-action-btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
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

  .history-loading {
    text-align: center;
    padding: 1rem;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #4b5563;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
