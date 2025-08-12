import { useState } from 'react';
import { Quiz } from '../../components/Quiz/Quiz';
import type { Quiz as QuizType } from '../../components/Quiz/types';
import { createQuiz } from '../../components/Quiz/utils';
import { handleAddQuestion as handleAddQuestionLogic } from './logic';
import { Logo } from '../../assets/Icons';
import { MessageInput } from '../../components/MessageInput';
import { SubmitButton } from '../../components/SubmitButton';

export function QuizPage() {
  const [quiz, setQuiz] = useState<QuizType>(createQuiz());
  const [newQuestion, setNewQuestion] = useState('');
  const [isGeneratingAnswers, setIsGeneratingAnswers] = useState(false);

  const handleAddQuestion = async () => {
    await handleAddQuestionLogic(newQuestion, quiz, setQuiz, setNewQuestion, setIsGeneratingAnswers);
  };

  return (
    <div style={styles.quizPage}>
      <div style={styles.quizPageHeader}>
        <h1 style={styles.quizPageHeaderH1}>Curate Mode</h1>
        <p style={styles.quizPageHeaderP}>Add questions to Curate AI answers</p>
      </div>

      <div style={styles.quizPageContent}>
        <div style={styles.addQuestionSection}>
          <div style={styles.questionInputGroup}>
            <MessageInput
              value={newQuestion}
              onChange={setNewQuestion}
              placeholder="Enter a new question..."
              disabled={isGeneratingAnswers}
              isLoading={isGeneratingAnswers}
              onEnterPress={handleAddQuestion}
              style={!isGeneratingAnswers ? { background: '#334155' } : {}}
            />
            <SubmitButton
              label={isGeneratingAnswers ? 'Generating...' : 'Add Question'}
              type="button"
              isInvalid={!newQuestion.trim()}
              disabled={isGeneratingAnswers}
              isLoading={isGeneratingAnswers}
              onClick={handleAddQuestion}
              loadingContent={
                <div style={styles.loadingButtonContent}>
                  <span style={styles.loadingLogo}>
                    <Logo
                      width={30}
                      height={30}
                      fill="#ffffff"
                    />
                  </span>
                  <span>Generating...</span>
                </div>
              }
            />
          </div>
        </div>

        <div style={styles.quizDisplaySection}>
          {quiz.questions.length > 0 ? (
            <Quiz quiz={quiz} />
          ) : (
            <div style={styles.emptyQuizState}>
              <p style={styles.emptyQuizStateP}>No questions added yet. Add your first question above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  quizPage: {
    height: '100vh',
    overflowY: 'auto' as const,
    padding: '2rem',
    background: '#0f172a',
  },
  quizPageHeader: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  quizPageHeaderH1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#e2e8f0',
    margin: '0 0',
  },
  quizPageHeaderP: {
    color: '#94a3b8',
    fontSize: '1.125rem',
    margin: 0,
  },
  quizPageContent: {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  addQuestionSection: {
    background: '#1e293b',
    borderRadius: '1rem',
    padding: '1rem',
    border: '1px solid #475569',
  },
  questionInputGroup: {
    display: 'flex',
    gap: '0.75rem',
  },
  loadingButtonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    lineHeight: 1,
  },
  loadingLogo: {
    animation: 'pulse 1.5s infinite ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    flexShrink: 0,
  },
  quizDisplaySection: {
    background: '#1e293b',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #475569',
    minHeight: '400px',
  },
  emptyQuizState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center' as const,
  },
  emptyQuizStateP: {
    margin: 0,
    fontSize: '1.125rem',
  },
};


