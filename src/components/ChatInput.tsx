import { FormEvent, useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ flexGrow: 1, padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc' }}
        disabled={isLoading}
      />
      <button 
        type="submit" 
        disabled={isLoading} 
        style={{ 
          padding: '8px 16px', 
          borderRadius: 4,
          opacity: isLoading ? 0.5 : 1
        }}
      >
        Send
      </button>
    </form>
  );
} 