import { Question as QuestionType } from "./types";
import { Answer } from "./Answer";
import './Quiz.css';

interface QuestionProps {
  question: QuestionType;
  questionNumber: number;
}

export function Question({ question, questionNumber }: QuestionProps) {
  const totalProviders = question.totalProviders;
  
  // Find the maximum number of providers for any answer
  const maxProviders = Math.max(...question.answers.map(answer => answer.providers.length));
  
  // Find winning answers (those with the most providers)
  const winningAnswers = question.answers.filter(
    answer => answer.providers.length === maxProviders && maxProviders > 0
  );

  // Calculate percentages
  const getPercentage = (providerCount: number) => {
    return totalProviders > 0 ? Math.round((providerCount / totalProviders) * 100) : 0;
  };

  return (
    <div className="quiz-question">
      <div className="quiz-question-header">
        <div className="quiz-question-number">{questionNumber}</div>
        <h3 className="quiz-question-title">{question.text}</h3>
        <p className="quiz-question-total">Total providers participating: <span className="quiz-question-total-number">{totalProviders}</span></p>
      </div>

      <div className="quiz-answers">
        {question.answers.map((answer, index) => {
          const providerCount = answer.providers.length;
          const percentage = getPercentage(providerCount);
          const isWinning = winningAnswers.some(winner => winner.answer === answer.answer);
          
          // Generate answer key based on the answer text or index
          let answerKey = String.fromCharCode(65 + index); // A, B, C, D...
          console.log("ANSwer KEY", answerKey);

          return (
            <Answer
              key={answer.answer}
              answer={answer}
              isWinning={isWinning}
              percentage={percentage}
              maxProviders={maxProviders}
              answerKey={answerKey}
            />
          );
        })}
      </div>

      {/* Question Summary */}
      <div className="quiz-question-summary">
        <div className="quiz-question-summary-grid">
          <div className="quiz-question-summary-item">
            <div className="quiz-question-summary-value">{totalProviders}</div>
            <div className="quiz-question-summary-label">Total Providers</div>
          </div>
          <div className="quiz-question-summary-item">
            <div className="quiz-question-summary-value">{maxProviders}</div>
            <div className="quiz-question-summary-label">Highest Count</div>
          </div>
          <div className="quiz-question-summary-item">
            <div className="quiz-question-summary-value">
              {winningAnswers.length > 1 ? "TIE" : winningAnswers[0]?.answer.split(' ').slice(-1)[0] || "-"}
            </div>
            <div className="quiz-question-summary-label">
              {winningAnswers.length > 1 ? "Multiple Winners" : "Current Leader"}
            </div>
          </div>
          <div className="quiz-question-summary-item">
            <div className="quiz-question-summary-value">
              {totalProviders > 0 ? Math.round((maxProviders / totalProviders) * 100) : 0}%
            </div>
            <div className="quiz-question-summary-label">Lead Margin</div>
          </div>
        </div>
      </div>
    </div>
  );
}
