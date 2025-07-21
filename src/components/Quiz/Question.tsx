import { Question as QuestionType } from "./types";
import { Answer } from "./Answer";

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
    <div className="question-card">
      <div className="question-header">
        <div className="question-title-row">
          <div className="question-number">
            <span>{questionNumber}</span>
          </div>
          <h3 className="question-text">{question.text}</h3>
        </div>
        <p className="question-info">
          Total providers participating: <span className="provider-count">{totalProviders}</span>
        </p>
      </div>

      <div className="answers-container">
        {question.answers.map((answer, index) => {
          const providerCount = answer.providers.length;
          const percentage = getPercentage(providerCount);
          const isWinning = winningAnswers.some(winner => winner.answer === answer.answer);
          
          // Generate answer key based on the answer text or index
          let answerKey = '';
          if (answer.answer.includes('Choice A')) answerKey = 'A';
          else if (answer.answer.includes('Choice B')) answerKey = 'B';
          else if (answer.answer.includes('Choice C')) answerKey = 'C';
          else if (answer.answer.includes('Choice D')) answerKey = 'D';
          else if (answer.answer.includes('X')) answerKey = 'X';
          else if (answer.answer.includes('Y')) answerKey = 'Y';
          else if (answer.answer.includes('Z')) answerKey = 'Z';
          else answerKey = String.fromCharCode(65 + index); // A, B, C, D...

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
      <div className="question-summary">
        <div className="summary-card">
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-value">{totalProviders}</div>
              <div className="summary-label">Total Providers</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">{maxProviders}</div>
              <div className="summary-label">Highest Count</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">
                {winningAnswers.length > 1
                  ? "TIE"
                  : winningAnswers[0]?.answer.split(' ').slice(-1)[0] || "-"}
              </div>
              <div className="summary-label">
                {winningAnswers.length > 1
                  ? "Multiple Winners"
                  : "Current Leader"}
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-value">
                {totalProviders > 0
                  ? Math.round((maxProviders / totalProviders) * 100)
                  : 0}
                %
              </div>
              <div className="summary-label">Lead Margin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
