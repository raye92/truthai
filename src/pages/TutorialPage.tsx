// ======== LANDING PAGE ========
import { useEffect, useState, useRef } from 'react';
import { Quiz } from '../components/Quiz/Quiz';
import type { Quiz as QuizType, Question as QuestionType, Answer as AnswerType } from '../components/Quiz/types';
import { MessageInput } from '../components/Input';

function buildTutorialQuiz(): QuizType {
  const q1Answers: AnswerType[] = [
    {
      answer: 'A Large Language Model (an AI that understands and generates text)',
      providers: ['GPT', 'Gemini', 'Gemini Google Search'],
    },
    { answer: 'A kind of database', providers: [] },
    { answer: 'A video game console', providers: [] },
  ];

  const q2Answers: AnswerType[] = [
    { answer: 'GPT', providers: ['GPT'] },
    { answer: 'Gemini', providers: ['Gemini'] },
    { answer: 'Gemini - backed by Google Search', providers: ['Gemini Google Search'] },
  ];

  const q1: QuestionType = {
    text: 'What is an LLM?',
    answers: q1Answers,
    totalProviders: q1Answers.reduce((sum, a) => sum + a.providers.length, 0),
    questionNumber: 1,
  };

  const q2: QuestionType = {
    text: 'What models are supported by CurateAI?',
    answers: q2Answers,
    totalProviders: q2Answers.reduce((sum, a) => sum + a.providers.length, 0),
    questionNumber: 2,
  };

  return { questions: [q1, q2] };
}

function TutorialPage() {
  const [quiz] = useState<QuizType>(() => buildTutorialQuiz());
  const [showHint, setShowHint] = useState(true);
  const [stage, setStage] = useState<'input' | 'quiz'>('input');
  const [showFinal, setShowFinal] = useState(false);
  const tutorialRef = useRef<HTMLDivElement>(null);
  const hardcodedPrompt = quiz.questions
    .map(q => `Q${q.questionNumber}: ${q.text}`)
    .join('\n\n');

  const scrollToTutorial = () => {
    tutorialRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFakeSubmit = () => {
    // Transition to quiz stage on submit
    setStage('quiz');
    setShowHint(true);
  };

  // Block typing while still allowing the built-in submit button
  useEffect(() => {
    if (stage !== 'input') return;
    const blockTyping = (e: KeyboardEvent) => {
      // Prevent MessageInput's global typing capture
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('keydown', blockTyping, true);
    return () => window.removeEventListener('keydown', blockTyping, true);
  }, [stage]);

  // Hide the final confirmation on any click
  useEffect(() => {
    if (!showFinal) return;
    let mounted = true;
    const attach = () => {
      if (!mounted) return;
      const onAnyClick = () => setShowFinal(false);
      window.addEventListener('click', onAnyClick, { capture: true, once: true });
    };
    // Defer to avoid catching the same click that showed the banner
    const id = setTimeout(attach, 0);
    return () => { mounted = false; clearTimeout(id); };
  }, [showFinal]);

  return (
    <div style={styles.landingPage}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>CurateAI</h1>
          <p style={styles.heroSubtitle}>Compare answers across multiple AI models</p>
          
          <div style={styles.demoVideoContainer}>
            <iframe
              style={styles.demoVideo}
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="CurateAI Demo"
            ></iframe>
          </div>

          <div style={styles.ctaButtonsContainer}>
            <button
              style={styles.curateModeButton}
              onClick={() => window.location.href = '/'}
            >
              Start Curating
            </button>
            <button
              style={styles.scrollButton}
              onClick={scrollToTutorial}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Tutorial Section */}
      <div ref={tutorialRef} style={styles.tutorialSection}>
        <div style={styles.tutorialHeader}>
          <h2 style={styles.tutorialTitle}>Tutorial</h2>
          <p style={styles.tutorialSubtitle}>Step by step guide to using Curate AI</p>
        </div>

        <div style={styles.tutorialContent}>
          <div style={styles.inputDisplaySection}>
            {stage === 'input' && (
              <div style={styles.hintOverlayInput}>
                <span style={styles.hintText}>Step 1: Submit a screenshot or ask a question to begin.</span>
              </div>
            )}
            <MessageInput
              value={hardcodedPrompt}
              onChange={() => {}}
              placeholder="Paste a screenshot or ask a question..."
              disabled={stage === 'quiz'}
              isLoading={false}
              onEnterPress={stage === 'input' ? handleFakeSubmit : undefined}
              submitLabel="Submit"
              showModelSelect={false}
            />
          </div>

          {stage === 'quiz' && (
            <div style={styles.quizDisplaySection} onClick={(e) => {
              // Check if the clicked element is a provider card by looking for title with "Vote"
              const target = e.target as HTMLElement;
              if (target.title && target.title.includes('Vote')) {
                if (showHint) setShowHint(false);
                setShowFinal(true);
              }
            }}>
              {showHint && (
                <div style={styles.hintOverlay}>
                  <span style={styles.hintText}>Step 2: Click ↑↑↑ to explore explanations for any answer.</span>
                </div>
              )}
              {showFinal && !showHint && (
                <div style={styles.finalOverlay}>
                  <span style={styles.finalText}>Great! You're ready to start curating answers.</span>
                </div>
              )}
              <Quiz quiz={quiz} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TutorialPage;

const styles = {
  landingPage: {
    minHeight: '100vh',
    background: '#0f172a',
    overflowX: 'hidden' as const,
    overflowY: 'auto' as const,
  },
  heroSection: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
  },
  heroContent: {
    textAlign: 'center' as const,
    maxWidth: '800px',
    width: '100%',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 800,
    color: '#e2e8f0',
    margin: '0 0 0 0',
    letterSpacing: '-0.025em',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    color: '#94a3b8',
    margin: '0 0 1.5rem 0',
    fontWeight: 400,
  },
  demoVideoContainer: {
    marginBottom: '1rem',
    borderRadius: '1rem',
    overflow: 'hidden',
    border: '1px solid #475569',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
  },
  demoVideo: {
    width: '100%',
    height: '400px',
    border: 'none',
  },
  ctaButtonsContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  curateModeButton: {
    padding: '0.875rem 2rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#0f172a',
    background: '#60a5fa',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  scrollButton: {
    padding: '0.875rem 2rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#e2e8f0',
    background: 'transparent',
    border: '1px solid #475569',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tutorialSection: {
    minHeight: '100vh',
    padding: '2rem 2rem 8rem 2rem',
    background: '#0f172a',
  },
  tutorialHeader: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  tutorialTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#e2e8f0',
    margin: '0 0 0.5rem 0',
  },
  tutorialSubtitle: {
    color: '#94a3b8',
    fontSize: '1.125rem',
    margin: 0,
  },
  tutorialContent: {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    maxWidth: '1000px',
  },
  quizDisplaySection: {
    background: '#1e293b',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #475569',
    minHeight: '400px',
    position: 'relative' as const,
  },
  inputDisplaySection: {
    background: '#1e293b',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #475569',
    position: 'relative' as const,
  },
  hintOverlay: {
    position: 'absolute' as const,
    left: '-40rem',
    right: 0,
    top: '15rem',
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none' as const,
    zIndex: 5,
    padding: '0 1rem',
  },
  hintOverlayInput: {
    position: 'absolute' as const,
    left: '70rem',
    right: '1rem',
    top: '1.75rem',
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none' as const,
    zIndex: 5,
    padding: '0 1rem',
  },
  hintText: {
    fontWeight: 600,
    background: '#22c55e',
    color: '#0b1b2a',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #16a34a',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  finalOverlay: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    top: '0.75rem',
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none' as const,
    zIndex: 1000,
    padding: '0 1rem',
  },
  finalText: {
    fontWeight: 600,
    background: '#38bdf8',
    color: '#082f49',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #0891b2',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
};
