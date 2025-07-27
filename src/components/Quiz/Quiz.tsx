import { Quiz as QuizType } from "./types";
import { Question } from "./Question";
import './Quiz.css';

interface QuizProps {
  quiz: QuizType;
}

export function Quiz({ quiz }: QuizProps) {
  const totalVotes = quiz.questions.reduce((total, question) => total + question.totalProviders, 0);
  return (
    <div className="quiz-root">
      <div className="quiz-header">
        <h1 className="quiz-title">Curated Answers</h1>
        <div className="quiz-total">Total models participating: <span className="quiz-total-number">{totalVotes}</span></div>
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
