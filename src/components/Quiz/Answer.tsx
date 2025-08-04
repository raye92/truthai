import { Answer as AnswerType } from "./types";
import { ProviderCard } from "./ProviderCard";
import './Quiz.css';

interface AnswerProps {
  answer: AnswerType;
  isWinning: boolean;
  percentage: number;
  maxProviders: number;
  answerKey: string;
  onKeyChange: (newKey: string) => void;
}

export function Answer({ answer, isWinning, percentage, maxProviders, answerKey, onKeyChange }: AnswerProps) {
  const providerCount = answer.providers.length;
  const leading = (providerCount / maxProviders) == 1 ? 1 : 0;
  const height = maxProviders > 0 ? (leading * 50) + ((percentage/2) * leading) + (percentage * (1-leading)) : 0;
  
  // Get color class based on winning status
  const getChoiceClass = () => {
    return isWinning ? 'winning' : 'non-winning';
  };

  // ======== TESTING ========
  // Prompt-based key reassignment for quick testing
  const handleKeyChange = () => {
    const raw = prompt('Enter new key letter (A-Z) or leave blank:', answerKey);
    if (raw === null) return; // user cancelled
    const trimmed = raw.trim();
    if (trimmed === '' || /^[A-Z]$/i.test(trimmed)) {
      onKeyChange(trimmed.toUpperCase());
    } else {
      alert('Invalid key. Please enter a single letter A-Z or leave blank.');
    }
  };

  return (
    <div className={`quiz-answer${isWinning ? ' quiz-answer-winning' : ''}`}> 
      <div className="quiz-answer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="quiz-answer-key">
            {answerKey}
            {/* ======== TESTING ======== */}
            <button onClick={handleKeyChange} title="Change key" style={{ marginLeft: '0.25rem', cursor: 'pointer', fontSize: '0.7rem' }}>✏️</button>
          </div>
          <div className="quiz-answer-text">{answer.answer}</div>
          {isWinning && <div className="quiz-answer-crown">👑 BEST ANSWER</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: 'auto' }}>
          <span className="quiz-answer-subtext">Confidence score:</span>
          <span className="quiz-answer-percent">{percentage}%</span>
        </div>
      </div>
      {providerCount > 0 ? (
        <div className="quiz-answer-bar-container">
          <div className="quiz-answer-bar-bg">
            <div className={`quiz-answer-bar ${getChoiceClass()}`} style={{ width: `${height}%` }}>
              {answer.providers.map((provider, index) => (
                <ProviderCard key={`${provider}-${index}`} providerName={provider} index={index} choiceClass={getChoiceClass()} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="quiz-answer-no-providers">No Answers</div>
      )}
    </div>
  );
}
