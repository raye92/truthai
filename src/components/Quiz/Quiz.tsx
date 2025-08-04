import { Quiz as QuizType } from "./types";
import { Question } from "./Question";

interface QuizProps {
  quiz: QuizType;
}

export function Quiz({ quiz }: QuizProps) {
  return (
    <div style={styles.quizRoot}>
      <div style={styles.quizQuestions}>
        {quiz.questions.map((question, index) => (
          <Question
            key={`question-${index}`}
            question={question}
            questionNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  quizRoot: {
    width: '100%',
    margin: '0 auto',
  },
  quizQuestions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
};
