import { Message } from "../hooks/useChat";
import "./MessageBubble.css";
import { Quiz } from "./Quiz/Quiz";
import type { Quiz as QuizType } from "./Quiz/types";

interface MessageBubbleProps {
  message: Message & { quizData?: QuizType; type?: string };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.type === 'quiz' && message.quizData) {
    return (
      <div className={`message-container ${message.role}`}>
        <div className="message-bubble quiz-message">
          <Quiz quiz={message.quizData} />
        </div>
      </div>
    );
  }
  return (
    <div className={`message-container ${message.role}`}>
      <div className="message-bubble">{message.content}</div>
    </div>
  );
}
