import { useState } from 'react';
import { Quiz } from '../../components/Quiz/Quiz';
import type { Quiz as QuizType } from '../../components/Quiz/types';
import { createQuiz } from '../../components/Quiz/utils';
import { handleAddQuestion as handleAddQuestionLogic } from './logic';
import { Logo } from '../../assets/Icons';

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
              {isGeneratingAnswers ? (
                <div style={styles.loadingButtonContent}>
                  <span style={styles.loadingLogo}>
                    <Logo
                      width={30}
                      height={30}
                      fill="#f8fafc"
                    />
                  </span>
                  <span>Generating...</span>
                </div>
              ) : (
                'Add Question'
              )}
            </button>
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
    background: '#0b1120',
  },
  quizPageHeader: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  quizPageHeaderH1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#e5e7eb',
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
    background: '#0f172a',
    borderRadius: '1rem',
    padding: '1rem',
    border: '1px solid #334155',
  },
  questionInputGroup: {
    display: 'flex',
    gap: '0.75rem',
  },
  questionInput: {
    flex: 1,
    minWidth: '200px',
    padding: '0.75rem 1rem',
    border: '1px solid #334155',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    background: '#0b1324',
    color: '#e5e7eb',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  questionInputDisabled: {
    background: '#0f172a',
    color: '#64748b',
    cursor: 'not-allowed',
  },
  addQuestionBtn: {
    padding: '0.75rem 1.5rem',
    background: '#2563eb',
    color: '#f8fafc',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    whiteSpace: 'nowrap' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  addQuestionBtnDisabled: {
    background: '#334155',
    cursor: 'not-allowed',
    transform: 'none',
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
    background: '#0f172a',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #334155',
    minHeight: '400px',
  },
  emptyQuizState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center' as const,
  },
  emptyQuizStateP: {
    margin: 0,
    fontSize: '1.125rem',
  },
};


