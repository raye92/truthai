import { Quiz as QuizType } from "./types";
import { Question } from "./Question";
import "./Quiz.css";

interface QuizProps {
  quiz: QuizType;
}

export function Quiz({ quiz }: QuizProps) {
  // Calculate total votes across all questions
  const totalVotes = quiz.questions.reduce((total, question) => total + question.totalProviders, 0);

  return (
    <div className="quiz-container">
      {/* Quiz Header - Simple title only */}
      <div className="quiz-header">
        <h1 className="quiz-title">
          Provider Quiz Results
        </h1>
        <div className="quiz-total-votes">
          Total providers participating: <span className="vote-count">{totalVotes}</span>
        </div>
      </div>

      {/* Questions */}
      <div className="questions-container">
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
