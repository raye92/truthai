import { useState } from 'react';
import { Quiz } from '../../components/Quiz/Quiz';
import type { Quiz as QuizType } from '../../components/Quiz/types';
import { createQuiz } from '../../components/Quiz/utils';
import { handleAddQuestion as handleAddQuestionLogic } from './logic';
import { MessageInput } from '../../components/Input';
import { useThrottledScroll } from '../../hooks/useThrottledScroll';

export function QuizPage() {
  const [quiz, setQuiz] = useState<QuizType>(createQuiz());
  const [newQuestion, setNewQuestion] = useState('');
  const [isGeneratingAnswers, setIsGeneratingAnswers] = useState(false);

  const handleAddQuestion = async () => {
    await handleAddQuestionLogic(newQuestion, quiz, setQuiz, setNewQuestion, setIsGeneratingAnswers);
  };

  const hasQuestions = quiz.questions.length > 0;

  const handleMainPageScroll = useThrottledScroll((e: React.UIEvent<HTMLDivElement>) => {
    // Throttled scroll handling for the main page section
    // This will prevent the glitchy scroll behavior you were experiencing
    console.log('Main page scroll position:', e.currentTarget.scrollTop);
  }, 4); // 16ms = 60fps for smooth scrolling

  return (
    <div style={styles.quizPage}>
      {/* Main Page Section */}
      <div 
        style={{ ...styles.mainPage, flex: hasQuestions ? 1 : 'none' }}
        onScroll={handleMainPageScroll}
      >
        <div style={styles.quizPageTitle}>
          <h1 style={styles.quizPageTitleH1}>Curate Mode</h1>
          <p style={styles.quizPageTitleP}>Add questions to Curate AI answers</p>
        </div>

        {hasQuestions && <Quiz quiz={quiz}/>}
      </div>

      {/* Footer Section */}
      <div style={{ 
        ...styles.footer, 
        height: hasQuestions ? 'auto' : '60vh',
        borderTop: hasQuestions ? '1px solid #334155' : 'none'
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
          initialWidth="60%"
        />
      </div>
    </div>
  );
}

const styles = {
  quizPage: {
    height: '100vh',
    minHeight: 0,
    background: '#0f172a',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden' as const,
  },
  mainPage: {
    padding: '2rem',
    minHeight: 0,
    overflowY: 'auto' as const,
  },
  footer: {
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: '1px solid #334155',
    flexShrink: 0,
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


