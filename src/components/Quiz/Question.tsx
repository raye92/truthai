import { useState, useEffect, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { motion } from "framer-motion";
import { Question as QuestionType, Answer as AnswerType } from "./types";
import { changeAnswerKey } from "./utils";
import { Answer } from "./Answer";
import 'react-grid-layout/css/styles.css';
import 'react-grid-layout/css/resizable.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface QuestionProps {
  question: QuestionType;
  questionNumber: number;
}

export function Question({ question, questionNumber }: QuestionProps) {
  // Local copy of answers so we can mutate keys for testing without affecting parent
  const [answers, setAnswers] = useState<AnswerType[]>(() => [...question.answers]);

  // Keep local answers in sync if parent changes
  useEffect(() => {
    setAnswers([...question.answers]);
  }, [question.answers]);

  // Produce a list of answers with a displayKey (auto-filled when blank) and sorted alphabetically.
  const displayAnswers = useMemo(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const used = new Set<string>();

    // Collect used keys from non-blank answers
    answers.forEach(ans => {
      if (ans.key && /^[A-Z]$/i.test(ans.key)) {
        used.add(ans.key.toUpperCase());
      }
    });

    // Build display list, assigning temporary letters for blanks
    let alphaIdx = 0;
    const derived = answers.map(ans => {
      let displayKey = ans.key ? ans.key.toUpperCase() : '';
      if (!displayKey) {
        while (alphaIdx < alphabet.length && used.has(alphabet[alphaIdx])) {
          alphaIdx++;
        }
        displayKey = alphabet[alphaIdx] || '?';
        used.add(displayKey);
        alphaIdx++;
      }
      return { answer: ans, displayKey };
    });

    // Sort alphabetically by the display key
    derived.sort((a, b) => a.displayKey.localeCompare(b.displayKey));

    return derived;
  }, [answers]);

  const totalProviders = question.totalProviders;

  // Compute values
  const maxProviders = answers.length > 0 ? Math.max(...answers.map(a => a.providers.length)) : 0;

  const winningAnswers = answers.filter(
    answer => answer.providers.length === maxProviders && maxProviders > 0
  );

  const getPercentage = (providerCount: number) => {
    return totalProviders > 0 ? Math.round((providerCount / totalProviders) * 100) : 0;
  };

  const handleKeyChange = (targetAnswer: AnswerType, newKey: string) => {
    setAnswers(prev => {
      const idx = prev.indexOf(targetAnswer);
      if (idx === -1) return prev;
      return changeAnswerKey(prev, idx, newKey);
    });
  };

  // Generate dynamic grid layout based on answer count
  const generateLayout = (answerCount: number) => {
    const layouts = {
      lg: [] as any[],
      md: [] as any[],
      sm: [] as any[],
      xs: [] as any[],
    };

    // Define grid configurations for different screen sizes
    const configs = {
      lg: { cols: 4, cardWidth: 6, cardHeight: 4 },
      md: { cols: 3, cardWidth: 4, cardHeight: 4 },
      sm: { cols: 2, cardWidth: 6, cardHeight: 5 },
      xs: { cols: 1, cardWidth: 12, cardHeight: 5 },
    };

    Object.entries(configs).forEach(([breakpoint, config]) => {
      const { cols, cardWidth, cardHeight } = config;
      
      for (let i = 0; i < answerCount; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        
        layouts[breakpoint as keyof typeof layouts].push({
          i: `answer-${i}`,
          x: col * cardWidth,
          y: row,
          w: cardWidth,
          h: cardHeight,
          static: true, // Prevent dragging
        });
      }
    });

    return layouts;
  };

  const layouts = generateLayout(displayAnswers.length);

  const breakpoints = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
  };

  const cols = {
    lg: 24,
    md: 12,
    sm: 12,
    xs: 12,
  };

  return (
    <motion.div 
      className="question-container"
      style={styles.questionContainer}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Question Header */}
      <motion.div 
        className="question-header"
        style={styles.questionHeader}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="question-number" style={styles.questionNumber}>
          {questionNumber}
        </div>
        
        <div className="question-content" style={styles.questionContent}>
          <h3 className="question-title" style={styles.questionTitle}>
            {question.text}
          </h3>
          
          <div className="question-stats" style={styles.questionStats}>
            <span className="total-responses" style={styles.totalResponses}>
              Total AI Responses: 
              <strong style={styles.totalResponsesNumber}> {totalProviders}</strong>
            </span>
            
            <span className="answer-count" style={styles.answerCount}>
              Answer Options: 
              <strong style={styles.answerCountNumber}> {answers.length}</strong>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Answers Grid */}
      {displayAnswers.length > 0 ? (
        <motion.div
          className="answers-container"
          style={styles.answersContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <ResponsiveGridLayout
            className="answers-grid"
            layouts={layouts}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={60}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            isDraggable={false}
            isResizable={false}
            style={styles.gridLayout}
          >
            {displayAnswers.map(({ answer, displayKey }, idx) => {
              const providerCount = answer.providers.length;
              const percentage = getPercentage(providerCount);
              const isWinning = winningAnswers.some(winner => winner.answer === answer.answer);

              return (
                <div key={`answer-${idx}`} className="grid-item">
                  <Answer
                    answer={answer}
                    isWinning={isWinning}
                    percentage={percentage}
                    maxProviders={maxProviders}
                    answerKey={displayKey}
                    onKeyChange={(newKey) => handleKeyChange(answer, newKey)}
                    index={idx}
                  />
                </div>
              );
            })}
          </ResponsiveGridLayout>
        </motion.div>
      ) : (
        <motion.div 
          className="no-answers"
          style={styles.noAnswers}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="no-answers-icon" style={styles.noAnswersIcon}>
            🤔
          </div>
          <p className="no-answers-text" style={styles.noAnswersText}>
            No answer options available yet
          </p>
          <p className="no-answers-subtext" style={styles.noAnswersSubtext}>
            AI responses will appear here as they're generated
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

const styles = {
  questionContainer: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '2px solid #f1f5f9',
  },
  questionNumber: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
    flexShrink: 0,
  },
  questionContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  questionTitle: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: '1.3',
  },
  questionStats: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  totalResponses: {
    fontSize: '0.95rem',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  totalResponsesNumber: {
    color: '#059669',
    fontWeight: '600',
  },
  answerCount: {
    fontSize: '0.95rem',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  answerCountNumber: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  answersContainer: {
    width: '100%',
  },
  gridLayout: {
    width: '100%',
    minHeight: '200px',
  },
  noAnswers: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '16px',
    border: '2px dashed #cbd5e1',
  },
  noAnswersIcon: {
    fontSize: '3rem',
    marginBottom: '16px',
  },
  noAnswersText: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  noAnswersSubtext: {
    margin: 0,
    fontSize: '1rem',
    color: '#6b7280',
    maxWidth: '400px',
  },
};
