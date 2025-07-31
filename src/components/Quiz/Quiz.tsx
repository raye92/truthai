import { Quiz as QuizType } from "./types";
import { Question } from "./Question";
import './Quiz.css';

interface QuizProps {
  quiz: QuizType;
}

export function Quiz({ quiz }: QuizProps) {
  return (
    <div className="quiz-root">
      <div className="quiz-header">
        <h1 className="quiz-title">Curated Answers</h1>
      </div>
      <div className="quiz-questions">
        {quiz.questions.map((question, index) => (
          <Question
            key={`question-${index}`}
            question={question}
            questionNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
