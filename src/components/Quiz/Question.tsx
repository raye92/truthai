import { useState, useEffect, useMemo } from 'react';
import { Question as QuestionType, Answer as AnswerType } from "./types";
import { changeAnswerKey } from "./utils";
import { Answer } from "./Answer";

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
  }, [answers]); // Only re-calculate when 'answers' changes

  const totalProviders = question.totalProviders;

  // Compute values
  const maxProviders = answers.length > 0 ? Math.max(...answers.map(a => a.providers.length)) : 0;

  const winningAnswers = answers.filter(
    answer => answer.providers.length === maxProviders && maxProviders > 0
  );

  const getPercentage = (providerCount: number) => {
    return totalProviders > 0 ? Math.round((providerCount / totalProviders) * 100) : 0;
  };

  // Calculate optimal grid layout to avoid uneven distribution
  const getBalancedGridStyle = (answerCount: number) => {
    const baseStyle = { ...styles.quizAnswers };

    if (answerCount === 4) {
      return { ...baseStyle, gridTemplateColumns: 'repeat(2, 1fr)' }; // 2x2 instead of 3+1
    }
    if (answerCount === 6) {
      return { ...baseStyle, gridTemplateColumns: 'repeat(3, 1fr)' }; // 3x2 instead of 4+2
    }
    if (answerCount === 5 || answerCount === 7) {
      return { ...baseStyle, gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }; // Use smaller minmax to distribute more evenly
    }
    return baseStyle;
  };

  const handleKeyChange = (targetAnswer: AnswerType, newKey: string) => {
    setAnswers(prev => {
      const idx = prev.indexOf(targetAnswer);
      if (idx === -1) return prev;
      return changeAnswerKey(prev, idx, newKey);
    });
  };

  const answersStyle = getBalancedGridStyle(answers.length);

  return (
    <div style={styles.quizQuestion}>
      <div style={styles.quizQuestionHeader}>
        <div style={styles.quizQuestionNumber}>{questionNumber}</div>
        <h3 style={styles.quizQuestionTitle}>{question.text}</h3>
        <p style={styles.quizQuestionTotal}>Current Answers: <span style={styles.quizQuestionTotalNumber}>{totalProviders}</span></p>
      </div>

      <div style={answersStyle}>
        {displayAnswers.map(({ answer, displayKey }, idx) => {
          const providerCount = answer.providers.length;
          const percentage = getPercentage(providerCount);
          const isWinning = winningAnswers.some(winner => winner.answer === answer.answer);

          return (
            <Answer
              key={answer.answer}
              answer={answer}
              isWinning={isWinning}
              percentage={percentage}
              maxProviders={maxProviders}
              answerKey={displayKey}
              onKeyChange={(newKey) => handleKeyChange(answer, newKey)}
            />
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  quizQuestion: {
    background: '#fff',
    borderRadius: '1.25rem',
    padding: '1.5rem',
    paddingTop: '1rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  quizQuestionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  quizQuestionNumber: {
    width: '2.5rem',
    height: '2.5rem',
    background: '#3b82f6',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.25rem',
  },
  quizQuestionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  quizQuestionTotal: {
    color: '#6b7280',
    marginLeft: 'auto',
    textAlign: 'right' as const,
  },
  quizQuestionTotalNumber: {
    fontWeight: '600',
  },
  quizAnswers: {
    display: 'grid',
    gap: '1rem',
    width: '100%',
    justifyItems: 'stretch',
    alignItems: 'stretch',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', // Responsive adjustments moved to external CSS
  },
};
