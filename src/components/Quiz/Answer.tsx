import { Answer as AnswerType } from "./types";
import { ProviderCard } from "./ProviderCard";
import './Quiz.css';

interface AnswerProps {
  answer: AnswerType;
  isWinning: boolean;
  percentage: number;
  maxProviders: number;
  answerKey: string;
}

export function Answer({ answer, isWinning, percentage, maxProviders, answerKey }: AnswerProps) {
  const providerCount = answer.providers.length;
  const leading = (providerCount / maxProviders) == 1 ? 1 : 0;
  const height = maxProviders > 0 ? (leading * 50) + ((percentage/2) * leading) + (percentage * (1-leading)) : 0;
  
  // Get color class based on winning status
  const getChoiceClass = () => {
    return isWinning ? 'winning' : 'non-winning';
  };

  return (
    <div className={`quiz-answer${isWinning ? ' quiz-answer-winning' : ''}`}> 
      <div className="quiz-answer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="quiz-answer-key">{answerKey}</div>
          <div className="quiz-answer-text">{answer.answer}</div>
          {isWinning && <div className="quiz-answer-crown">👑 BEST ANSWER</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: 'auto' }}>
          <span className="quiz-answer-subtext">Confidence score:</span>
          <span className="quiz-answer-percent">{percentage}%</span>
        </div>
      </div>
      <div className="quiz-answer-bar-container">
        <div className="quiz-answer-bar-bg">
          <div className={`quiz-answer-bar ${getChoiceClass()}`} style={{ width: `${height}%` }}>
            {answer.providers.map((provider, index) => (
              <ProviderCard key={`${provider.name}-${index}`} provider={provider} index={index} choiceClass={getChoiceClass()} />
            ))}
            {providerCount === 0 && <div className="quiz-answer-no-providers">No providers yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
