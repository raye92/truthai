// ======== DEMO ========
import React, { useState } from 'react';
import { ChatLogic } from '../api/chat/chatLogic';
import { useChatStore } from '../api/chat/chatStore';
import { Conversation, Message } from '../api/chat/types';

const DemoPage: React.FC = () => {
  const [messageContent, setMessageContent] = useState<string>('Hello, this is a test message!');
  const [provider, setProvider] = useState<string>('openai');
  const [model, setModel] = useState<string>('gpt-4');
  
  const { 
    conversations, 
    currentConversation, 
    setCurrentConversation,
    addMessage
  } = useChatStore();

  // Test functions
  const testCreateConversation = async (type: "Chat" | "Short-response" | "Long-form") => {
    try {
      console.log(`Creating ${type} conversation...`);
      const conversationId = await ChatLogic.createConversation(type);
      console.log(`Created conversation: ${conversationId}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const testLoadConversations = async () => {
    try {
      console.log('Loading conversations...');
      await ChatLogic.loadConversations();
      console.log('Conversations loaded');
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const testAddMessage = async () => {
    if (!currentConversation) {
      alert('Please select a conversation first');
      return;
    }
    
    try {
      console.log('Adding message...');
      const messageId = await ChatLogic.addMessage(
        currentConversation.conversationId,
        'user',
        messageContent,
        provider,
        model,
      );
      console.log(`Message added with ID: ${messageId}`);
      setMessageContent(''); // Clear input after sending
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const testLoadMessages = async (conversationId: string) => {
    try {
      console.log('Loading messages...');
      await ChatLogic.loadMessages(conversationId);
      console.log('Messages loaded');
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  return (
    <div className="demo-page" style={{ 
      padding: '24px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      overflowY: 'auto',
      height: '100vh'
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>Chat Logic Demo Page</h1>
      
      {/* User ID Input */}
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>User ID:</label>
      </div>

      {/* Test Buttons */}
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Test Chat Logic Functions</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px', 
          marginBottom: '16px' 
        }}>
          <div>
            <h3 style={{ fontWeight: '500', marginBottom: '8px' }}>Create Conversations:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => testCreateConversation("Chat")}
                style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                Create Chat Conversation
              </button>
              <button
                onClick={() => testCreateConversation("Short-response")}
                style={{ width: '100%', backgroundColor: '#10b981', color: 'white', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                Create Short-response Conversation
              </button>
              <button
                onClick={() => testCreateConversation("Long-form")}
                style={{ width: '100%', backgroundColor: '#8b5cf6', color: 'white', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
              >
                Create Long-form Conversation
              </button>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontWeight: '500', marginBottom: '8px' }}>Other Functions:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={testLoadConversations}
                style={{ width: '100%', backgroundColor: '#f97316', color: 'white', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
              >
                Load Conversations
              </button>
              <button
                onClick={() => testLoadMessages(currentConversation?.conversationId || '')}
                disabled={!currentConversation}
                style={{ 
                  width: '100%', 
                  backgroundColor: currentConversation ? '#14b8a6' : '#9ca3af', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  border: 'none', 
                  cursor: currentConversation ? 'pointer' : 'not-allowed' 
                }}
                onMouseOver={(e) => {
                  if (currentConversation) e.currentTarget.style.backgroundColor = '#0d9488';
                }}
                onMouseOut={(e) => {
                  if (currentConversation) e.currentTarget.style.backgroundColor = '#14b8a6';
                }}
              >
                Load Messages
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Message Section */}
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Add Message</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '16px' 
        }}>
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Message content"
            style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
          <input
            type="text"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="Provider"
            style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
            style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
          <button
            onClick={testAddMessage}
            disabled={!currentConversation}
            style={{ 
              backgroundColor: currentConversation ? '#10b981' : '#9ca3af', 
              color: 'white', 
              padding: '8px', 
              borderRadius: '4px', 
              border: 'none', 
              cursor: currentConversation ? 'pointer' : 'not-allowed' 
            }}
            onMouseOver={(e) => {
              if (currentConversation) e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseOut={(e) => {
              if (currentConversation) e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            Add Message
          </button>
        </div>
      </div>

      {/* Conversations Display */}
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Conversations ({conversations.length})</h2>
        {conversations.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No conversations yet. Create one using the buttons above.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {conversations.map((conversation) => (
              <div
                key={conversation.conversationId}
                onClick={() => selectConversation(conversation)}
                style={{
                  padding: '12px',
                  border: currentConversation?.conversationId === conversation.conversationId 
                    ? '2px solid #3b82f6' 
                    : '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: currentConversation?.conversationId === conversation.conversationId 
                    ? '#eff6ff' 
                    : 'white'
                }}
                onMouseOver={(e) => {
                  if (currentConversation?.conversationId !== conversation.conversationId) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentConversation?.conversationId !== conversation.conversationId) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '500' }}>{conversation.title}</span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {conversation.messages.length} messages
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>
                  ID: {conversation.conversationId}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Conversation Messages */}
      {currentConversation && (
        <div style={{ padding: '16px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            Current Conversation: {currentConversation.title}
          </h2>
          
          {currentConversation.messages.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No messages in this conversation yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentConversation.messages.map((message, index) => (
                <div
                  key={message.messageId || index}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: message.role === 'user' ? '#dbeafe' : '#f3f4f6',
                    marginLeft: message.role === 'user' ? '32px' : '0',
                    marginRight: message.role === 'assistant' ? '32px' : '0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ 
                      fontWeight: '500', 
                      fontSize: '14px',
                      color: message.role === 'user' ? '#1d4ed8' : '#374151'
                    }}>
                      {message.role === 'user' ? 'User' : 'Assistant'}
                    </span>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      <div>{message.metadata.provider}</div>
                      <div>{message.metadata.model}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px' }}>{message.content}</div>
                  {message.messageId && (
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                      ID: {message.messageId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Store State Debug */}
      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fefce8', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Store State Debug</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px' 
        }}>
          <div>
            <h3 style={{ fontWeight: '500', marginBottom: '8px' }}>Current Conversation:</h3>
            <pre style={{ 
              fontSize: '12px', 
              backgroundColor: 'white', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #d1d5db', 
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {currentConversation ? JSON.stringify(currentConversation, null, 2) : 'null'}
            </pre>
          </div>
          <div>
            <h3 style={{ fontWeight: '500', marginBottom: '8px' }}>All Conversations:</h3>
            <pre style={{ 
              fontSize: '12px', 
              backgroundColor: 'white', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #d1d5db', 
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(conversations, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
