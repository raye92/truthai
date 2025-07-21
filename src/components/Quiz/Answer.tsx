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
  const height = maxProviders > 0 ? (providerCount / maxProviders) * 100 : 0;
  return (
    <div className={`quiz-answer${isWinning ? ' quiz-answer-winning' : ''}`}> 
      <div className="quiz-answer-header">
        <div className="quiz-answer-key">{answerKey}</div>
        <div className="quiz-answer-text">{answer.answer}</div>
        {isWinning && <div className="quiz-answer-crown">👑 WINNING</div>}
        <div className="quiz-answer-count">{providerCount} providers</div>
        <div className="quiz-answer-percent">{percentage}%</div>
      </div>
      <div className="quiz-answer-providers">
        {answer.providers.map((provider, index) => (
          <ProviderCard key={`${provider.name}-${index}`} provider={provider} index={index} />
        ))}
        {providerCount === 0 && <div className="quiz-answer-no-providers">No providers yet</div>}
      </div>
      <div className="quiz-answer-bar-container">
        <div className="quiz-answer-bar-bg">
          <div className="quiz-answer-bar" style={{ width: `${height}%` }} />
        </div>
        <div className="quiz-answer-bar-label">{percentage}%</div>
      </div>
    </div>
  );
}

