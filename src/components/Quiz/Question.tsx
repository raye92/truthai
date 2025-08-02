import { useState, useEffect } from 'react';
import { Question as QuestionType, Answer as AnswerType } from "./types";
import { changeAnswerKey } from "./utils";
import { Answer } from "./Answer";
import './Quiz.css';

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
  const displayAnswers = (() => {
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

    // Debug print
    console.log(
      'Normalized answers →',
      derived.map(d => `${d.displayKey}: ${d.answer.answer}`)
    );

    return derived;
  })();

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

  const handleKeyChange = (targetAnswer: AnswerType, newKey: string) => {
    setAnswers(prev => {
      const idx = prev.indexOf(targetAnswer);
      if (idx === -1) return prev;
      return changeAnswerKey(prev, idx, newKey);
    });
  };

  const gridClass = getBalancedGridClass(answers.length);
  const answersClassName = `quiz-answers${gridClass ? ` ${gridClass}` : ''}`;

  return (
    <div className="quiz-question">
      <div className="quiz-question-header">
        <div className="quiz-question-number">{questionNumber}</div>
        <h3 className="quiz-question-title">{question.text}</h3>
        <p className="quiz-question-total">Current Answers: <span className="quiz-question-total-number">{totalProviders}</span></p>
      </div>

      <div className={answersClassName}>
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
