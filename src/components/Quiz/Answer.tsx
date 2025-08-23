import { useRef, useLayoutEffect, useState } from 'react';
import { Answer as AnswerType } from "./types";
import { ProviderCard } from "./ProviderCard";

interface AnswerProps {
  answer: AnswerType;
  isWinning: boolean;
  percentage: number;
  maxProviders: number;
  answerKey: string;
  onKeyChange: (newKey: string) => void;
  forceFullRow?: boolean;
  answerWidth?: number;
  onProviderClick?: (providerName: string, answerText: string) => void;
}

export function Answer({ answer, isWinning, percentage, maxProviders, answerKey, onKeyChange, forceFullRow = false, answerWidth, onProviderClick }: AnswerProps) {
  const providerCount = answer.providers.length;
  const leading = (providerCount / maxProviders) == 1 ? 1 : 0;
  const height = maxProviders > 0 ? (leading * 50) + ((percentage/2) * leading) + (percentage * (1-leading)) : 0;
  
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [isTall, setIsTall] = useState(false);

  useLayoutEffect(() => {
    if (textRef.current) {
      const style = getComputedStyle(textRef.current);
      const lineHeight = parseFloat(style.lineHeight || '16');
      const threshold = lineHeight * 3; // approximate height for 3 lines
      setIsTall(textRef.current.offsetHeight > threshold);
    }
  }, [answer.answer]);
  
  
  const getChoiceClass = () => {
    return isWinning ? 'winning' : 'non-winning';
  };

  const getBarStyle = () => {
    const baseStyle = { ...styles.quizAnswerBar, width: `${height}%` };
    if (isWinning) {
      return {
        ...baseStyle,
        borderColor: '#f59e0b',
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      };
    } else {
      return {
        ...baseStyle,
        borderColor: '#6b7280',
        background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
      };
    }
  };

  return (
    <div
        style={{
          ...(isWinning ? { ...styles.quizAnswer, ...styles.quizAnswerWinning } : styles.quizAnswer),
          ...((isTall || forceFullRow) ? { gridColumn: '1 / -1' } : {}),
          ...(answerWidth ? { minWidth: answerWidth } : {}),
        }}
      > 
      <div style={styles.quizAnswerHeader}>
        <div style={styles.quizAnswerKey}>
          {answerKey}
        </div>
        <div style={styles.quizAnswerText} ref={textRef}>{answer.answer}</div>
        {isWinning && <div style={styles.quizAnswerCrown}>👑 BEST ANSWER</div>}
        <div style={styles.quizAnswerConfidence}>
          <span style={styles.quizAnswerSubtext}>Confidence score:</span>
          <span style={styles.quizAnswerPercent}>{percentage}%</span>
        </div>
      </div>
      {providerCount > 0 ? (
        <div style={styles.quizAnswerBarContainer}>
          <div style={styles.quizAnswerBarBg} ref={barRef}>
            <div style={getBarStyle()}>
              {answer.providers.map((provider, index) => (
                <ProviderCard
                  key={`${provider}-${index}`}
                  providerName={provider}
                  index={index}
                  choiceClass={getChoiceClass()}
                  onClick={onProviderClick ? () => onProviderClick(provider, answer.answer) : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.quizAnswerNoProviders}>No Answers</div>
      )}
    </div>
  );
}

const styles = {
  quizAnswer: {
    padding: '0.75rem',
    borderRadius: '1rem',
    background: '#334155',
    transition: 'box-shadow 0.3s',
    marginBottom: '0.5rem',
  },
  quizAnswerWinning: {
    background: '#1e293b',
    border: '2px solid #f59e0b',
    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
  },
  quizAnswerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
    width: '100%',
  },
  quizAnswerKey: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2.5rem',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#e2e8f0',
    borderRight: '4px solid #e2e8f0',
    borderTop: '4px solid transparent',
    borderBottom: '4px solid transparent',
    borderRadius: '0 1rem 1rem 0',
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
    boxSizing: 'border-box' as const,
    flexShrink: 0,
  },
  quizAnswerText: {
    fontWeight: '600',
    fontSize: '1rem',
    wordBreak: 'break-word' as const,
    flex: '1 1 auto',
    minWidth: '0',
    color: '#e2e8f0',
  },
  quizAnswerCrown: {
    minWidth: '130px',
    color: '#f59e0b',
    fontWeight: '600',
    fontSize: '0.95rem',
    flexShrink: '0',
  },
  quizAnswerConfidence: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    flexShrink: '0',
    marginLeft: 'auto',
  },
  quizAnswerPercent: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'right' as const,
    color: '#e2e8f0',
  },
  quizAnswerSubtext: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    textAlign: 'right' as const,
  },
  quizAnswerProviders: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  quizAnswerNoProviders: {
    color: '#94a3b8',
    fontStyle: 'italic',
    fontSize: '0.875rem',
    padding: '0.5rem',
  },
  quizAnswerBarContainer: {
    position: 'relative' as const,
    marginTop: '0.5rem',
  },
  quizAnswerBarBg: {
    width: '100%',
    background: '#475569',
    borderRadius: '0.75rem',
    height: '3rem',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  quizAnswerBar: {
    height: '100%',
    borderRadius: '0.75rem',
    transition: 'width 0.7s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem',
    flexWrap: 'nowrap' as const,
    border: '2px solid transparent',
    minWidth: '0',
  },
};
