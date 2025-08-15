import { useState, useEffect, useMemo } from 'react';
import { Question as QuestionType, Answer as AnswerType } from "./types";
import { changeAnswerKey } from "./utils";
import { AnswerGrid } from "./AnswerGrid";

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

  const handleKeyChange = (targetAnswer: AnswerType, newKey: string) => {
    setAnswers(prev => {
      const idx = prev.indexOf(targetAnswer);
      if (idx === -1) return prev;
      return changeAnswerKey(prev, idx, newKey);
    });
  };

  return (
    <div style={styles.quizQuestion}>
      <div style={styles.quizQuestionHeader}>
        <div style={styles.quizQuestionNumber}>{question.questionNumber ?? questionNumber}</div>
        <h3 style={styles.quizQuestionTitle}>{question.text}</h3>
        <p style={styles.quizQuestionTotal}>Current Answers: <span style={styles.quizQuestionTotalNumber}>{totalProviders}</span></p>
      </div>

      <AnswerGrid
        displayAnswers={displayAnswers}
        winningAnswers={winningAnswers}
        maxProviders={maxProviders}
        totalProviders={totalProviders}
        onKeyChange={handleKeyChange}
        questionText={question.text} // propagate the question text
      />
    </div>
  );
}

const styles = {
  quizQuestion: {
    background: '#1e293b',
    borderRadius: '1.25rem',
    padding: '1.5rem',
    paddingTop: '1rem',
    border: '1px solid #475569',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
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
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.25rem',
  },
  quizQuestionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  quizQuestionTotal: {
    color: '#94a3b8',
    marginLeft: 'auto',
    textAlign: 'right' as const,
  },
  quizQuestionTotalNumber: {
    fontWeight: '600',
    color: '#e2e8f0',
  },
};
