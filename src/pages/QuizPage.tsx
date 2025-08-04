import { useState } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { Quiz } from '../components/Quiz/Quiz';
import { Quiz as QuizType, Question as QuizQuestion, Answer as QuizAnswer } from '../components/Quiz/types';
import { 
  createQuiz, 
  createQuestion, 
  createAnswer, 
  addAnswerToQuestion, 
  addQuestionToQuiz, 
  updateQuestionInQuiz
} from '../components/Quiz/utils';

const client = generateClient<Schema>();

export function QuizPage() {
  const [quiz, setQuiz] = useState<QuizType>(createQuiz());
  const [newQuestion, setNewQuestion] = useState('');
  const [isGeneratingAnswers, setIsGeneratingAnswers] = useState(false);
  
  // Hardcoded instruction prompt - can be made configurable later
  const INSTRUCTION_PROMPT = `# Identity
    You are a helpful quiz taking assistant that answers questions in JSON format

    # Instructions
    * Only output JSON format
    * Label responses with the question number and answer as key-value pairs
    * If question number is not specified, start numbering from 1
    * Your response should not have additional formatting or commentary

    # Examples
    <question id="single-question">
    Question 10
    When it comes to predicting a person's career success as an adult, how informative are traditional IQ tests?
      They are only marginally reliable in predicting the success of business executives.
      They are totally unreliable in predicting the success of business executives.
      They are moderately reliable in predicting the success of business executives.
      They are highly reliable in predicting the success of business executives.
    </question>

    <assistant_response id="single-question">
    {
      "10": They are only marginally reliable in predicting the success of business executives
    }
    </assistant_response>

    <question id="multi-question">
    Which geographic region historically has the lowest rate of divorce, based on international surveys? Eastern Europe Middle East North America Sub-Saharan Africa
    What is 2+2? 2 3 5 9
    </question>

    <assistant_response id="multi-question">
    {
    "1": Sub-Saharan Africa
    "2": 4
    }
  </assistant_response>`;

  // Calls the q-layout Lambda to parse questions and choices
  interface LayoutChoice { key: string; text: string }
  interface LayoutItem { question: string; questionNumber: string; choices: LayoutChoice[] }

  const runLayoutPrompt = async (promptText: string): Promise<LayoutItem[]> => {
    try {
      const result = await client.queries.promptLayout({ prompt: promptText });
      if (!result || result.errors) {
        console.error('Layout prompt error:', result?.errors);
        return [];
      }
      console.log('Layout prompt result:', result.data);
      const raw = (result.data ?? '').trim();
      if (!raw) return [];
      let parsed: LayoutItem[] = [];
      try {
        const json = JSON.parse(raw);
        parsed = Array.isArray(json) ? json : [json];
      } catch (err) {
        console.error('Failed to parse layout JSON:', err, raw);
        return [];
      }
      return parsed;
    } catch (err) {
      console.error('Layout prompt exception:', err);
      return [];
    }
  };

  const queryAIProviders = async (question: string) => {
    setIsGeneratingAnswers(true);
    
    const fullPrompt = `${INSTRUCTION_PROMPT}\n\nQuestion: ${question}`;
    
    // Kick off layout prompt concurrently
    const layoutDonePromise = runLayoutPrompt(question);

    const providers = [
      "GPT",
      "Gemini", 
      "Gemini Google Grounded"
    ];

    // Query each provider separately so results show up individually
    const queryProvider = async (provider: string) => {
      try {
        let result;
        
        if (provider === "GPT") {
          result = await client.queries.promptGpt({ prompt: fullPrompt });
        } else if (provider === "Gemini") {
          result = await client.queries.promptGemini({ prompt: fullPrompt, useGrounding: false });
        } else if (provider === "Gemini Google Grounded") {
          result = await client.queries.promptGemini({ prompt: fullPrompt, useGrounding: true });
        }

        if (result && !result.errors && result.data && result.data.trim()) {
          const response = result.data.trim();
          
          // Wait for layout prompt to finish before adding answers
          await layoutDonePromise;

          console.log(`Adding answer from ${provider}:`, response.substring(0, 100) + (response.length > 100 ? '...' : ''));
          
          // Add answer after layout is ready
          setQuiz(prevQuiz => {
            const questionIndex = prevQuiz.questions.length - 1; // Latest question
            if (questionIndex < 0) return prevQuiz;
            
            const questionToUpdate = prevQuiz.questions[questionIndex];
            const newAnswer = createAnswer(response, provider);
            const updatedQuestion = addAnswerToQuestion(questionToUpdate, newAnswer);
            
            return updateQuestionInQuiz(prevQuiz, questionIndex, updatedQuestion);
          });
        } else {
          console.error(`Error from ${provider}:`, result?.errors);
        }
      } catch (error) {
        console.error(`Error querying ${provider}:`, error);
      }
    };

    // Start all provider queries simultaneously
    const promises = providers.map((provider) => queryProvider(provider));
    
    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Error querying AI providers:', error);
    } finally {
      setIsGeneratingAnswers(false);
    }
  };

  const handleAddQuestion = async () => {
    const input = newQuestion.trim();
    if (!input) return;

    setIsGeneratingAnswers(true);

    // Parse layout using the q-layout Lambda
    const layoutItems = await runLayoutPrompt(input);
    if (layoutItems.length === 0) {
      console.log("response:", runLayoutPrompt(input));
      alert('Could not parse question layout.');
      setIsGeneratingAnswers(false);
      return;
    }

    setNewQuestion('');

    for (const item of layoutItems) {
      const questionText = item.question !== 'No question provided' ? item.question : input;

      // Skip duplicate questions
      if (quiz.questions.some(q => q.text === questionText)) continue;

      let questionObj = createQuestion(questionText);

      for (const choice of item.choices) {
        let answerObj = createAnswer(choice.text);
        answerObj = { ...answerObj, key: choice.key.toUpperCase() };
        questionObj = addAnswerToQuestion(questionObj, answerObj);
      }

      setQuiz(prevQuiz => addQuestionToQuiz(prevQuiz, questionObj));

      // Kick off provider queries for this question (do not await to allow parallelism)
      queryAIProviders(questionText);
    }
    setIsGeneratingAnswers(false);
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
