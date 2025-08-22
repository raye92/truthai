export interface Message {
  messageId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: {
    provider: string;
    model: string;
  };
}

export interface Conversation {
  conversationId: string;
  title: string;
  messages: Message[];
  nextMessageToken: string | null;
  isSaved: boolean;
}