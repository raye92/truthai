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
  
  // ======== TESTING ========
  const loadTestQuiz = () => {
    const testQuiz = createQuiz();
    
    // Test Question 1
    const question1 = createQuestion("What is the capital of France?");
    const answer1A = createAnswer("Paris");
    answer1A.key = "A";
    answer1A.providers = ["GPT", "Gemini", "Gemini Google Grounded"];
    
    const answer1B = createAnswer("London");
    answer1B.key = "B";
    answer1B.providers = ["GPT"];
    
    const answer1C = createAnswer("Berlin");
    answer1C.key = "C";
    answer1C.providers = [];
    
    const answer1D = createAnswer("Madrid");
    answer1D.key = "D";
    answer1D.providers = ["Gemini"];
    
    const question1WithAnswers = addAnswerToQuestion(question1, answer1A);
    const question1WithMoreAnswers = addAnswerToQuestion(question1WithAnswers, answer1B);
    const question1WithEvenMoreAnswers = addAnswerToQuestion(question1WithMoreAnswers, answer1C);
    const question1Complete = addAnswerToQuestion(question1WithEvenMoreAnswers, answer1D);
    
    // Test Question 2
    const question2 = createQuestion("Which programming language is most popular for web development?");
    const answer2A = createAnswer("JavaScript");
    answer2A.key = "B";
    answer2A.providers = ["GPT", "Gemini", "Gemini Google Grounded"];
    
    const answer2B = createAnswer("Python, sex xess dfsdfk sdflsvosdivndsivnxnv skodvnksndvosdinvsodivnsldkvsnlcidjcoiafa amsdofney asss sesx smonekys ass sex");
    answer2B.key = "A";
    answer2B.providers = ["GPT", "Gemini"];
    
    const answer2C = createAnswer("Java");
    answer2C.key = "C";
    answer2C.providers = ["Gemini"];
    
    const answer2D = createAnswer("C++");
    answer2D.key = "D";
    answer2D.providers = [];
    
    const answer2E = createAnswer("TypeScript");
    answer2E.key = "E";
    answer2E.providers = ["GPT"];
    
    const question2WithAnswers = addAnswerToQuestion(question2, answer2A);
    const question2WithMoreAnswers = addAnswerToQuestion(question2WithAnswers, answer2B);
    const question2WithEvenMoreAnswers = addAnswerToQuestion(question2WithMoreAnswers, answer2C);
    const question2WithEvenMoreAnswers2 = addAnswerToQuestion(question2WithEvenMoreAnswers, answer2D);
    const question2Complete = addAnswerToQuestion(question2WithEvenMoreAnswers2, answer2E);
    
    // Add questions to quiz
    const quizWithQuestion1 = addQuestionToQuiz(testQuiz, question1Complete);
    const finalQuiz = addQuestionToQuiz(quizWithQuestion1, question2Complete);
    
    setQuiz(finalQuiz);
  };
  // ======== TESTING ========
  
  // Hardcoded instruction prompt - can be made configurable later
  const INSTRUCTION_PROMPT = `# Identity
    You are a helpful quiz-taking assistant that reads JSON question payloads and replies strictly in JSON.

    # Input format
    - The content between <question> and </question> will be either a single JSON object or an array of JSON objects.
    - Each object has the shape: { "question": string, "questionNumber": string, "choices": Array<{ "key": string, "text": string }> }.
    - The "choices" array may be empty when the question has no provided options.

    # Output format
    - Output only a single JSON object.
    - Use each question's "questionNumber" as the key (as a string).
    - If "choices" is empty: return a concise free-form answer string.
    - If exactly one choice is correct: return the chosen choice TEXT (not the key).
    - If multiple choices are correct: return an array of the chosen choice TEXT strings.
    - Do not include explanations or any extra formatting.

    # Examples
    <question id="single-question-no-choices">
      {
        "question": "Who wrote 'To Kill a Mockingbird'?",
        "questionNumber": "1",
        "choices": []
      }
    </question> 

    <assistant_response id="single-question-no-choices">
    {
      "1": "Harper Lee"
    }
    </assistant_response>

    <question id="single-question-multiple-answers">
      {
        "question": "Which of the following are prime numbers?",
        "questionNumber": "2",
        "choices": [
          { "key": "A", "text": "2" },
          { "key": "B", "text": "3" },
          { "key": "C", "text": "4" },
          { "key": "D", "text": "5" }
        ]
      }
    </question> 

    <assistant_response id="single-question-multiple-answers">
    {
      "2": ["2", "3", "5"]
    }
    </assistant_response>

    <question id="multi-question-mixed">
      [
        {
          "question": "What is the square root of 144?",
          "questionNumber": "3",
          "choices": []
        },
        {
          "question": "What is the capital of Japan?",
          "questionNumber": "4",
          "choices": [
            { "key": "A", "text": "Kyoto" },
            { "key": "B", "text": "Osaka" },
            { "key": "C", "text": "Tokyo" },
            { "key": "D", "text": "Hiroshima" }
          ]
        },
        {
          "question": "Which animals are mammals?",
          "questionNumber": "5",
          "choices": [
            { "key": "A", "text": "Dolphin" },
            { "key": "B", "text": "Crocodile" },
            { "key": "C", "text": "Bat" },
            { "key": "D", "text": "Penguin" }
          ]
        }
      ]
    </question> 

    <assistant_response id="multi-question-mixed">
    {
      "3": "12",
      "4": "Tokyo",
      "5": ["Dolphin", "Bat"]
    }
    </assistant_response>`;

  // Calls the q-layout Lambda to parse questions and choices
  interface LayoutChoice { key: string; text: string }
  interface LayoutItem { question: string; questionNumber: string | number; choices: LayoutChoice[] }

  // Fetch raw layout string from backend
  const runLayoutPrompt = async (promptText: string): Promise<string> => {
    try {
      const result = await client.queries.promptLayout({ prompt: promptText });
      if (!result || result.errors) {
        console.error('Layout prompt error:', result?.errors);
        return '';
      }
      const raw = (result.data ?? '').trim();
      console.log('Layout prompt result (raw):', raw);
      return raw;
    } catch (err) {
      console.error('Layout prompt exception:', err);
      return '';
    }
  };

  // Parse raw layout string into structured items for UI
  const parseLayoutPrompt = (rawLayout: string): LayoutItem[] => {
    if (!rawLayout) return [];
    const cleaned = stripCodeFences(rawLayout);
    try {
      const json = JSON.parse(cleaned);
      return Array.isArray(json) ? json : [json];
    } catch (err) {
      console.error('Failed to parse layout JSON:', err, cleaned);
      return [];
    }
  };

  // Remove surrounding Markdown code fences like ```json ... ``` or ``` ... ```
  function stripCodeFences(text: string): string {
    const trimmed = (text ?? '').trim();
    const fenceMatch = trimmed.match(/^```(?:\w+)?\s*([\s\S]*?)\s*```$/);
    if (fenceMatch) {
      return String(fenceMatch[1]).trim();
    }
    // Soft clean: remove a leading ```lang and trailing ``` if present
    return trimmed
      .replace(/^```(?:\w+)?\s*/,'')
      .replace(/\s*```$/,'')
      .trim();
  }

  const queryAIProviders = async (layoutJsonString: string, questionTextMap: Record<string, string>) => {
    const fullPrompt = `${INSTRUCTION_PROMPT}\n\n<question id="user">\n${layoutJsonString}\n</question>`;
    
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
          const cleanedResponse = stripCodeFences(response);
          console.log(`Provider ${provider} raw response:`, cleanedResponse.substring(0, 120) + (cleanedResponse.length > 120 ? '...' : ''));

          // Parse provider JSON and map answers to the correct questions
          let answersByQuestion: Record<string, unknown> = {};
          try {
            const parsed = JSON.parse(cleanedResponse);
            if (parsed && typeof parsed === 'object') {
              answersByQuestion = parsed as Record<string, unknown>;
            }
          } catch (err) {
            console.error(`Failed to parse provider ${provider} JSON:`, err, cleanedResponse);
            return;
          }

          for (const [questionNumberKeyRaw, value] of Object.entries(answersByQuestion)) {
            const questionNumberKey = String(questionNumberKeyRaw);
            const questionText = questionTextMap[questionNumberKey] || '';
            if (!questionText) continue;

            const addAnswerTextToQuestion = (answerText: string) => {
              const trimmed = String(answerText).trim();
              if (!trimmed) return;
              setQuiz(prevQuiz => {
                const questionIndex = prevQuiz.questions.findIndex(q => q.text === questionText);
                if (questionIndex < 0) return prevQuiz;
                const questionToUpdate = prevQuiz.questions[questionIndex];
                const answerToAdd = createAnswer(trimmed, provider);
                const updatedQuestion = addAnswerToQuestion(questionToUpdate, answerToAdd);
                return updateQuestionInQuiz(prevQuiz, questionIndex, updatedQuestion);
              });
            };

            if (Array.isArray(value)) {
              for (const choiceText of value) {
                addAnswerTextToQuestion(String(choiceText));
              }
            } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
              addAnswerTextToQuestion(String(value));
            } else if (value && typeof value === 'object') {
              const maybeText = (value as any).text ?? '';
              if (maybeText) addAnswerTextToQuestion(String(maybeText));
            }
          }
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

    // ======== NONBLOCKING ========
    // Start the layout prompt and immediately kick off provider queries using the SAME input text
    // const layoutPromise = runLayoutPrompt(input);
    // queryAIProviders(input, layoutPromise); // Fire-and-forget – we do not await it here

    // // Wait for the layout prompt so we can build the question(s) ======== DEBUG ========
    // const layoutItems = await layoutPromise;
    // ======== NONBLOCKING ========

    // First, run the layout prompt and get raw JSON string
    const rawLayout = await runLayoutPrompt(input);
    let layoutItems = parseLayoutPrompt(rawLayout);
    console.log('Layout items:', layoutItems);
    let effectiveLayoutJson = rawLayout;
    if (layoutItems.length === 0) {
      console.log('Layout prompt returned no items for input:', input, '— using fallback layout.');
      layoutItems = [
        { question: input, questionNumber: 1, choices: [] }
      ];
      effectiveLayoutJson = JSON.stringify(layoutItems);
    }

    setNewQuestion('');

    // Build map of questionNumber -> questionText for provider mapping
    const questionTextMap: Record<string, string> = {};

    for (const item of layoutItems) {
      const questionText = item.question !== 'No question provided' ? item.question : input;
      const questionNumberKey = String(item.questionNumber ?? '');
      if (questionNumberKey) {
        questionTextMap[questionNumberKey] = questionText;
      }

      // Skip duplicates
      if (quiz.questions.some((q) => q.text === questionText)) continue;

      let questionObj = createQuestion(questionText);

      for (const choice of item.choices) {
        let answerObj = createAnswer(choice.text);
        answerObj = { ...answerObj, key: choice.key.toUpperCase() };
        questionObj = addAnswerToQuestion(questionObj, answerObj);
      }

      // Add the new question to the quiz state
      setQuiz((prevQuiz) => addQuestionToQuiz(prevQuiz, questionObj));
    }

    // Now that questions are laid out in the UI, query AI providers using the JSON from layout prompt
    if (layoutItems.length > 0) {
      await queryAIProviders(effectiveLayoutJson, questionTextMap);
    }
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
            <button 
              onClick={loadTestQuiz} 
              style={styles.testButton}
            >
              Load Test Quiz
            </button>
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
  testButton: { //======== TESTING ========
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
