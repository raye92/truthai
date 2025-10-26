import { useState, useRef, useEffect } from 'react';
import { Quiz } from '../../components/Quiz/Quiz';
import type { Quiz as QuizType } from '../../components/Quiz/types';
import { createQuiz } from '../../components/Quiz/utils';
import { handleAddQuestion as handleAddQuestionLogic } from './logic';
import { MessageInput } from '../../components/Input';

export function QuizPage() {
  const [quiz, setQuiz] = useState<QuizType>(createQuiz());
  const [newQuestion, setNewQuestion] = useState('');
  const [isGeneratingAnswers, setIsGeneratingAnswers] = useState(false);
  // ======== MOBILE DETECTION ========
  const [isMobile, setIsMobile] = useState(false); 
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleAddQuestion = async () => {
    await handleAddQuestionLogic(newQuestion, quiz, setQuiz, setNewQuestion, setIsGeneratingAnswers);
    if (contentRef.current) {
      const el = contentRef.current;
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      });
    }
  };

  const hasQuestions = quiz.questions.length > 0;

  // ======== MOBILE DETECTION ========
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Log quiz object and contents whenever quiz changes
  useEffect(() => {
    console.log('=== QUIZ OBJECT ===');
    console.log('Quiz:', quiz);
    console.log('Quiz Questions Count:', quiz.questions.length);
    console.log('Quiz Contents:');
    quiz.questions.forEach((question, index) => {
      console.log(`Question ${index + 1}:`, question.text);
      console.log(`  Total Providers: ${question.totalProviders}`);
      console.log(`  Answers (${question.answers.length}):`);
      question.answers.forEach((answer, answerIndex) => {
        console.log(`    ${String.fromCharCode(65 + answerIndex)}. ${answer.answer}`);
        console.log(`       Providers: [${answer.providers.join(', ')}]`);
      });
      console.log('---');
    });
    console.log('==================');
  }, [quiz]);

  return (
    <div style={styles.quizPage}>
      <div style={styles.contentContainer} ref={contentRef}>
        <div style={styles.quizPageTitle}>
          <h1 style={styles.quizPageTitleH1}>Curate Mode</h1>
          <p style={styles.quizPageTitleP}>Add questions to Curate AI answers</p>
        </div>
        {/* ======== MOBILE DETECTION ======== */}
        {isMobile && (
          <div style={styles.mobileOverlay} onClick={() => setIsMobile(false)}>
            <div style={styles.mobileAlertBox} onClick={(e) => e.stopPropagation()}>
              <div style={styles.mobileAlertText}>
                CurateAI is best on the web - Phone support coming soon!
              </div>
            </div>
          </div>
        )}
        
        {hasQuestions && <Quiz quiz={quiz}/>} 
      </div>

      <div style={{
        ...styles.inputBarWrapper,
        padding: `16px 16px ${hasQuestions ? '16px' : '50vh'} 16px`,
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
          height={hasQuestions ? 40 : 104}
          width={hasQuestions ? '100%' : '60%'}
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
  // ======== MOBILE DETECTION ========
  mobileOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 1000,
    padding: '20px',
  },
  mobileAlertBox: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '16px',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    border: '1px solid #475569',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
  },
  mobileAlertText: {
    color: '#f1f5f9',
    fontSize: '1.1rem',
    fontWeight: 500,
    textAlign: 'center' as const,
    lineHeight: 1.4,
  },
};


