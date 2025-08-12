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
    console.log(`Calculating width for answer "${answer.answer}" with key "${displayKey}": baseWidth=${baseWidth}, keyWidth=${keyWidth}, winningBonus=${winningBonus}, textWidth=${textWidth}`);
    
    return baseWidth + keyWidth + winningBonus + textWidth;
  };

  // Group answers into rows based on available width
  const answerRows = useMemo(() => {
    const rows: AnswerRow[] = [];
    const maxRowWidth = windowWidth - 165; // Maximum width for a row (window width - 165px)
    console.log('maxRowWidth:', maxRowWidth);
    const minGap = 16; // Gap between answers
    console.log('Starting grouping rows');
    
    let currentRow: AnswerRow = { answers: [], totalWidth: 0 };
    console.log('Initialized new currentRow');
    
    displayAnswers.forEach(({ answer, displayKey }) => {
      const answerWidth = calculateAnswerWidth(answer, displayKey);
      console.log(`Considering answer ${displayKey}, width: ${answerWidth}`);
      // Width this answer would add including gap if not first in row
      const widthWithGap = answerWidth + (currentRow.answers.length > 0 ? minGap : 0);

      // If it would overflow, commit current row and start fresh
      if (currentRow.answers.length > 0 && (currentRow.totalWidth + widthWithGap) > maxRowWidth) {
        console.log(`Row overflow, pushing row with keys: [${currentRow.answers.map(r => r.displayKey).join(', ')}], totalWidth: ${currentRow.totalWidth}`);
        rows.push(currentRow);
        currentRow = { answers: [], totalWidth: 0 };
        console.log('Reset currentRow after overflow');
      }

      // Recompute gap (new row may have been started)
      const finalWidthWithGap = answerWidth + (currentRow.answers.length > 0 ? minGap : 0);
      currentRow.answers.push({ answer, displayKey });
      currentRow.totalWidth += finalWidthWithGap;
      console.log(`Added answer ${displayKey}, new currentRow totalWidth: ${currentRow.totalWidth}`);
    });
    
    // Add the last row if it has answers
    if (currentRow.answers.length > 0) {
      console.log(`Pushing final row with keys: [${currentRow.answers.map(r => r.displayKey).join(', ')}], totalWidth: ${currentRow.totalWidth}`);
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

            return (
              <div key={answer.answer} style={styles.answerWrapper}>
                <Answer
                  answer={answer}
                  isWinning={isWinning}
                  percentage={percentage}
                  maxProviders={maxProviders}
                  answerKey={displayKey}
                  onKeyChange={(newKey) => onKeyChange(answer, newKey)}
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