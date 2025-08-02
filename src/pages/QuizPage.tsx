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
import './QuizPage.css';

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
      const raw = (result.data ?? '').trim();
      if (!raw) return [];
      let parsed: LayoutItem[] = [];
      try {
        parsed = JSON.parse(raw);
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

    // Parse layout using the q-layout Lambda
    const layoutItems = await runLayoutPrompt(input);
    if (layoutItems.length === 0) {
      alert('Could not parse question layout.');
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
  };

  return (
    <div className="quiz-page">
      <div className="quiz-page-header">
        <h1>Curate Mode</h1>
        <p>Add questions to Curate AI answers</p>
      </div>

      <div className="quiz-page-content">
        <div className="add-question-section">
          <div className="question-input-group">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter a new question..."
              className="question-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAddQuestion()}
              disabled={isGeneratingAnswers}
            />
            <button onClick={handleAddQuestion} className="add-question-btn" disabled={isGeneratingAnswers}>
              {isGeneratingAnswers ? 'Generating Answers...' : 'Add Question'}
            </button>
          </div>

          {isGeneratingAnswers && (
            <div className="loading-indicator">
              <p>🤖 Querying AI providers for answers...</p>
            </div>
          )}
        </div>

        <div className="quiz-display-section">
          {quiz.questions.length > 0 ? (
            <Quiz quiz={quiz} />
          ) : (
            <div className="empty-quiz-state">
              <p>No questions added yet. Add your first question above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
