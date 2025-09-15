import { useState } from 'react';
import { Quiz } from '../../components/Quiz/Quiz';
import type { Quiz as QuizType } from '../../components/Quiz/types';
import { createQuiz } from '../../components/Quiz/utils';
import { handleAddQuestion as handleAddQuestionLogic } from './logic';
import { MessageInput } from '../../components/Input';

export function QuizPage() {
  const [quiz, setQuiz] = useState<QuizType>(createQuiz());
  const [newQuestion, setNewQuestion] = useState('');
  const [isGeneratingAnswers, setIsGeneratingAnswers] = useState(false);

  const handleAddQuestion = async () => {
    await handleAddQuestionLogic(newQuestion, quiz, setQuiz, setNewQuestion, setIsGeneratingAnswers);
  };

  const hasQuestions = quiz.questions.length > 0;

  return (
    <div style={styles.quizPage}>
      <div style={styles.contentContainer}>
        <div style={styles.quizPageTitle}>
          <h1 style={styles.quizPageTitleH1}>Curate Mode</h1>
          <p style={styles.quizPageTitleP}>Add questions to Curate AI answers</p>
        </div>
        {hasQuestions && <Quiz quiz={quiz}/>} 
      </div>

      <div style={{
        ...styles.inputBarWrapper,
        padding: `16px 16px ${hasQuestions ? '16px' : '369px'} 16px`,
        transition: 'padding 0.3s ease-in-out'
      }}>
        <MessageInput
          value={newQuestion}
          onChange={setNewQuestion}
          placeholder="Enter a new question..."
          disabled={isGeneratingAnswers}
          isLoading={isGeneratingAnswers}
          onEnterPress={handleAddQuestion}
          showModelSelect={false}
          submitLabel={isGeneratingAnswers ? 'Generating...' : 'Add Question'}
          initialHeight={150}
          initialWidth={hasQuestions ? '100%' : '60%'}
        />
      </div>
    </div>
  );
}

const styles = {
  quizPage: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '2rem',
    background: '#0f172a',
  },
  inputBarWrapper: {
    padding: '16px',
    background: '#0f172a',
    display: 'flex',
    justifyContent: 'center',
  },
  quizPageTitle: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  quizPageTitleH1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#e2e8f0',
    margin: '0 0',
  },
  quizPageTitleP: {
    color: '#94a3b8',
    fontSize: '1.125rem',
    margin: 0,
  },
};


