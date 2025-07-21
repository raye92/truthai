import { Answer as AnswerType } from "./types";
import { ProviderCard } from "./ProviderCard";

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

  // Get CSS class for choice-specific styling
  const getChoiceClass = (key: string) => {
    const keyMap: Record<string, string> = {
      'A': 'choice-a',
      'B': 'choice-b', 
      'C': 'choice-c',
      'D': 'choice-d'
    };
    return keyMap[key] || 'choice-a';
  };

  return (
    <div className={`answer-card ${isWinning ? 'winning' : ''}`}>
      <div className="answer-header">
        <div className="answer-left">
          <div className="answer-key">
            {answerKey}
          </div>
          <div className="answer-text">{answer.answer}</div>
          {isWinning && (
            <div className="winning-badge">
              <span className="winning-crown">👑</span>
              <span className="winning-text">WINNING</span>
            </div>
          )}
        </div>
        <div className="answer-stats">
          <div className="provider-count">{providerCount} providers</div>
          <div className="answer-percentage">{percentage}%</div>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="providers-section">
        <div className="providers-grid">
          {answer.providers.map((provider, index) => (
            <ProviderCard
              key={`${provider.name}-${index}`}
              provider={provider}
              index={index}
            />
          ))}
          {providerCount === 0 && (
            <div className="no-providers">
              No providers yet
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar with Provider Visualization */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className={`progress-fill ${getChoiceClass(answerKey)}`}
            style={{ width: `${height}%` }}
          >
            {/* Mini provider logos in the bar */}
            {answer.providers.slice(0, Math.min(8, answer.providers.length)).map((provider, index) => (
              <div
                key={`bar-${provider.name}-${index}`}
                className="mini-provider"
              >
                <span className="mini-provider-number">
                  {index + 1}
                </span>
              </div>
            ))}
            {answer.providers.length > 8 && (
              <div className="mini-provider-overflow">
                <span className="mini-provider-number">+</span>
              </div>
            )}
            {isWinning && (
              <div className="winning-animation" />
            )}
          </div>
        </div>
        <div className="progress-percentage">
          <span className="progress-percentage-text">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}

