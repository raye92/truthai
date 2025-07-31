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

  // Calculate optimal grid layout to avoid uneven distribution
  const getBalancedGridClass = (answerCount: number) => {
    if (answerCount === 4) {
      return 'balanced-4'; // 2x2 instead of 3+1
    }
    if (answerCount === 6) {
      return 'balanced-6'; // 3x2 instead of 4+2
    }
    if (answerCount === 5 || answerCount === 7) {
      return 'force-balanced'; // Use smaller minmax to distribute more evenly
    }
    return '';
  };

  const gridClass = getBalancedGridClass(question.answers.length);
  const answersClassName = `quiz-answers${gridClass ? ` ${gridClass}` : ''}`;

  return (
    <div className="quiz-question">
      <div className="quiz-question-header">
        <div className="quiz-question-number">{questionNumber}</div>
        <h3 className="quiz-question-title">{question.text}</h3>
        <p className="quiz-question-total">Current Answers: <span className="quiz-question-total-number">{totalProviders}</span></p>
      </div>

      <div className={answersClassName}>
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
    </div>
  );
}
