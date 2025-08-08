import { useState } from 'react';
import { Quiz } from '../../components/Quiz/Quiz';
import type { Quiz as QuizType } from '../../components/Quiz/types';
import { createQuiz } from '../../components/Quiz/utils';
import { handleAddQuestion as handleAddQuestionLogic } from './logic';

export function QuizPage() {
  const [quiz, setQuiz] = useState<QuizType>(createQuiz());
  const [newQuestion, setNewQuestion] = useState('');
  const [isGeneratingAnswers, setIsGeneratingAnswers] = useState(false);

  // ======== TESTING ========
  const loadTestQuiz = () => {
    // retain existing testing helper in the component file
    // You can bring over or reimplement the testing data here if still needed
  };
  // ======== TESTING ========

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
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter a new question..."
              style={{
                ...styles.questionInput,
                ...(isGeneratingAnswers ? styles.questionInputDisabled : {})
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
              disabled={isGeneratingAnswers}
            />
            <button 
              onClick={handleAddQuestion} 
              style={{
                ...styles.addQuestionBtn,
                ...(isGeneratingAnswers ? styles.addQuestionBtnDisabled : {})
              }}
              disabled={isGeneratingAnswers}
            >
              {isGeneratingAnswers ? 'Generating Answers...' : 'Add Question'}
            </button>
            {/* ======== TESTING ======== */}
            <button onClick={loadTestQuiz} style={styles.testButton}>Load Test Quiz</button>
            {/* ======== TESTING ======== */}
          </div>

          {isGeneratingAnswers && (
            <div style={styles.loadingIndicator}>
              <p style={styles.loadingIndicatorP}>🤖 Querying AI providers for answers...</p>
            </div>
          )}
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
    background: 'white',
  },
  quizPageHeader: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  quizPageHeaderH1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1f2937',
    margin: '0 0',
  },
  quizPageHeaderP: {
    color: '#6b7280',
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
    background: '#f9fafb',
    borderRadius: '1rem',
    padding: '1rem',
    border: '1px solid #e5e7eb',
  },
  questionInputGroup: {
    display: 'flex',
    gap: '0.75rem',
  },
  questionInput: {
    flex: 1,
    minWidth: '200px',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    background: 'white',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  questionInputDisabled: {
    background: '#f3f4f6',
    color: '#9ca3af',
    cursor: 'not-allowed',
  },
  addQuestionBtn: {
    padding: '0.75rem 1.5rem',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    whiteSpace: 'nowrap' as const,
  },
  addQuestionBtnDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed',
    transform: 'none',
  },
  testButton: {
    padding: '0.75rem 1.5rem',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    whiteSpace: 'nowrap' as const,
  },
  quizDisplaySection: {
    background: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #e5e7eb',
    minHeight: '400px',
  },
  emptyQuizState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center' as const,
  },
  emptyQuizStateP: {
    margin: 0,
    fontSize: '1.125rem',
  },
  loadingIndicator: {
    marginTop: '1rem',
    padding: '1rem',
    background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)',
    borderRadius: '0.5rem',
    textAlign: 'center' as const,
    border: '1px solid #d1d5db',
  },
  loadingIndicatorP: {
    margin: 0,
    color: '#374151',
    fontWeight: 500,
    animation: 'pulse 2s infinite',
  },
};


