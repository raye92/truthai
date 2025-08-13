import { Answer as AnswerType } from "./types";
import { Answer } from "./Answer";
import { useMemo, useState, useEffect } from "react";

interface AnswerGridProps {
  displayAnswers: Array<{ answer: AnswerType; displayKey: string }>;
  winningAnswers: AnswerType[];
  maxProviders: number;
  totalProviders: number;
  onKeyChange: (targetAnswer: AnswerType, newKey: string) => void;
}

interface AnswerRow {
  answers: Array<{ answer: AnswerType; displayKey: string }>;
  totalWidth: number;
}

export function AnswerGrid({ 
  displayAnswers, 
  winningAnswers, 
  maxProviders, 
  totalProviders, 
  onKeyChange 
}: AnswerGridProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPercentage = (providerCount: number) => {
    return totalProviders > 0 ? Math.round((providerCount / totalProviders) * 100) : 0;
  };

  // Calculate minimum width for each answer
  const calculateAnswerWidth = (answer: AnswerType, displayKey: string) => {
    const isWinning = winningAnswers.some(winner => winner.answer === answer.answer);
    const baseWidth = 170; // 110 + 20 header margins + 24 answer padding + 16 gap
    const keyWidth = 40; // Width for the key
    const winningBonus = isWinning ? 140 : 0; // Bonus width if winning
    const textWidth = Math.ceil(
      answer.answer.length > 18
        ? answer.answer.length * 8 * 0.6
        : answer.answer.length * 16 * 0.6
    ); // Text length * 16 font (double line if longer answers)
    
    return baseWidth + keyWidth + winningBonus + textWidth;
  };

  // Group answers into rows based on available width
  const answerRows = useMemo(() => {
    const rows: AnswerRow[] = [];
    const maxRowWidth = windowWidth - 165; // Maximum width for a row (window width - 165px)
    
    let currentRow: AnswerRow = { answers: [], totalWidth: 0 };
    
    displayAnswers.forEach(({ answer, displayKey }) => {
      const answerWidth = calculateAnswerWidth(answer, displayKey);

      // If adding this answer would overflow, commit current row and start fresh
      if (currentRow.answers.length > 0 && currentRow.totalWidth + answerWidth > maxRowWidth) {
        rows.push(currentRow);
        currentRow = { answers: [], totalWidth: 0 };
      }

      currentRow.answers.push({ answer, displayKey });
      currentRow.totalWidth += answerWidth; // update running total
    });
    
    // Add the last row if it has answers
    if (currentRow.answers.length > 0) {
      rows.push(currentRow);
    }
    
    return rows;
  }, [displayAnswers, winningAnswers, windowWidth]);

  return (
    <div style={styles.container}>
      {answerRows.map((row, rowIndex) => (
        <div key={rowIndex} style={styles.row}>
          {row.answers.map(({ answer, displayKey }) => {
            const providerCount = answer.providers.length;
            const percentage = getPercentage(providerCount);
            const isWinning = winningAnswers.some(winner => winner.answer === answer.answer);
            const answerWidth = calculateAnswerWidth(answer, displayKey);

            return (
              <div key={answer.answer} style={{ ...styles.answerWrapper, minWidth: answerWidth }}>
                <Answer
                  answer={answer}
                  isWinning={isWinning}
                  percentage={percentage}
                  maxProviders={maxProviders}
                  answerKey={displayKey}
                  onKeyChange={(newKey) => onKeyChange(answer, newKey)}
                  answerWidth={answerWidth}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    width: '100%',
  },
  row: {
    display: 'flex',
    gap: '1rem',
    // flexWrap: 'wrap' as const,
    alignItems: 'stretch',
  },
  answerWrapper: {
    flex: '1 1 auto',
    minWidth: '0',
  },
};