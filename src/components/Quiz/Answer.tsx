<<<<<<< HEAD
import { motion } from "framer-motion";
=======
import { useRef, useLayoutEffect, useState } from 'react';
>>>>>>> origin/main
import { Answer as AnswerType } from "./types";
import { ProviderCard } from "./ProviderCard";

interface AnswerProps {
  answer: AnswerType;
  isWinning: boolean;
  percentage: number;
  maxProviders: number;
  answerKey: string;
  onKeyChange: (newKey: string) => void;
<<<<<<< HEAD
  index: number;
}

export function Answer({ 
  answer, 
  isWinning, 
  percentage, 
  maxProviders, 
  answerKey, 
  onKeyChange, 
  index 
}: AnswerProps) {
=======
  forceFullRow?: boolean;
}

export function Answer({ answer, isWinning, percentage, maxProviders, answerKey, onKeyChange, forceFullRow = false }: AnswerProps) {
>>>>>>> origin/main
  const providerCount = answer.providers.length;
  
<<<<<<< HEAD
  // Handle key change with prompt
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

  // Calculate confidence score for visual representation
  const confidenceScore = Math.min(percentage, 100);

  return (
    <motion.div
      className="answer-card"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      style={{
        ...styles.answerCard,
        ...(isWinning ? styles.answerCardWinning : {}),
      }}
    >
      {/* Header Section */}
      <div className="answer-header" style={styles.answerHeader}>
        <div className="answer-key-section" style={styles.answerKeySection}>
          <motion.div 
            className="answer-key"
            style={{
              ...styles.answerKey,
              ...(isWinning ? styles.answerKeyWinning : styles.answerKeyDefault)
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {answerKey}
            <button 
              onClick={handleKeyChange} 
              title="Change key" 
              style={styles.keyEditButton}
            >
              ✏️
            </button>
          </motion.div>
        </div>
        
        <div className="answer-content" style={styles.answerContent}>
          <h4 className="answer-text" style={styles.answerText}>
            {answer.answer}
          </h4>
          
          {isWinning && (
            <motion.div 
              className="best-answer-badge"
              style={styles.bestAnswerBadge}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              👑 Best Answer
            </motion.div>
          )}
        </div>
      </div>

      {/* Confidence Score Section */}
      <div className="confidence-section" style={styles.confidenceSection}>
        <div className="confidence-label" style={styles.confidenceLabel}>
          Confidence Score
=======
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
                />
              ))}
            </div>
          </div>
>>>>>>> origin/main
        </div>
        
        <div className="confidence-display" style={styles.confidenceDisplay}>
          <div className="confidence-bar-bg" style={styles.confidenceBarBg}>
            <motion.div 
              className="confidence-bar"
              style={{
                ...styles.confidenceBar,
                width: `${confidenceScore}%`,
                background: isWinning 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${confidenceScore}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
            />
          </div>
          
          <span className="confidence-percentage" style={styles.confidencePercentage}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Providers Section */}
      <div className="providers-section" style={styles.providersSection}>
        <div className="providers-label" style={styles.providersLabel}>
          AI Providers ({providerCount})
        </div>
        
        {providerCount > 0 ? (
          <motion.div 
            className="providers-grid"
            style={styles.providersGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            {answer.providers.map((provider, providerIndex) => (
              <motion.div
                key={`${provider}-${providerIndex}`}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: index * 0.1 + 0.5 + providerIndex * 0.1,
                  type: "spring",
                  stiffness: 150
                }}
              >
                <ProviderCard 
                  providerName={provider} 
                  index={providerIndex} 
                  choiceClass={isWinning ? 'winning' : 'non-winning'} 
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="no-providers" style={styles.noProviders}>
            No AI responses yet
          </div>
        )}
      </div>

      {/* Visual Enhancement Elements */}
      <div className="card-accent" style={{
        ...styles.cardAccent,
        background: isWinning 
          ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
          : 'linear-gradient(135deg, #06b6d4, #0891b2)'
      }} />
    </motion.div>
  );
}

const styles = {
  answerCard: {
    position: 'relative' as const,
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  answerCardWinning: {
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    border: '2px solid #f59e0b',
    boxShadow: '0 8px 32px rgba(245, 158, 11, 0.15)',
  },
  answerHeader: {
    display: 'flex',
<<<<<<< HEAD
    alignItems: 'flex-start',
    gap: '16px',
  },
  answerKeySection: {
=======
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
    width: '100%',
  },
  quizAnswerKey: {
    width: '2.25rem',
    textAlign: 'center' as const,
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#000000',
  },
  quizAnswerText: {
    fontWeight: '600',
    fontSize: '1rem',
    wordBreak: 'break-word' as const,
    flex: '1 1 auto',
    minWidth: '0',
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
  },
  quizAnswerSubtext: {
    fontSize: '0.8rem',
    color: '#6b7280',
    textAlign: 'right' as const,
  },
  quizAnswerProviders: {
>>>>>>> origin/main
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    minWidth: '60px',
  },
  answerKey: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  answerKeyDefault: {
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    color: '#334155',
    border: '2px solid #cbd5e1',
  },
  answerKeyWinning: {
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    color: '#ffffff',
    border: '2px solid #d97706',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
  },
  keyEditButton: {
    position: 'absolute' as const,
    top: '-6px',
    right: '-6px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: 'none',
    background: '#ffffff',
    cursor: 'pointer',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s ease',
  },
  answerContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  answerText: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: '1.4',
    wordBreak: 'break-word' as const,
  },
  bestAnswerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#ffffff',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    alignSelf: 'flex-start',
    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
  },
  confidenceSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  confidenceLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
  },
  confidenceDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  confidenceBarBg: {
    flex: 1,
    height: '8px',
    background: '#f1f5f9',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  confidenceBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 1s ease-out',
  },
  confidencePercentage: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    minWidth: '50px',
    textAlign: 'right' as const,
  },
  providersSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginTop: 'auto',
  },
  providersLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
  },
  providersGrid: {
    display: 'flex',
<<<<<<< HEAD
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  noProviders: {
    color: '#9ca3af',
    fontStyle: 'italic',
    fontSize: '0.875rem',
    textAlign: 'center' as const,
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px dashed #d1d5db',
  },
  cardAccent: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    borderTopLeftRadius: '16px',
    borderBottomLeftRadius: '16px',
=======
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem',
    flexWrap: 'nowrap' as const,
    border: '2px solid transparent',
    minWidth: '0',
>>>>>>> origin/main
  },
};
