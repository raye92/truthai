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

  // Function that prints numbers every second for exactly 5 seconds and returns a promise
  const runLayoutPrompt = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      let counter = 1;
      const interval = setInterval(() => {
        console.log(counter);
        counter++;
        if (counter > 5) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  };

  const queryAIProviders = async (question: string) => {
    setIsGeneratingAnswers(true);
    
    const fullPrompt = `${INSTRUCTION_PROMPT}\n\nQuestion: ${question}`;
    
    const providers = [
      "GPT",
      "Gemini", 
      "Gemini Google Grounded"
    ];

    // Kick off layout prompt and get a promise that resolves when done
    const layoutDone = runLayoutPrompt();

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
          
          // Wait until layout prompt completes
          await layoutDone;

          console.log(`Adding answer from ${provider}:`, response.substring(0, 100) + (response.length > 100 ? '...' : ''));
          
          // Add answer once allowed and on lambda function completion
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

    // Start all queries simultaneously but delay adding answers until layout prompt is finished
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
    if (!newQuestion.trim()) return;
    
    const existingQuestion = quiz.questions.find(q => q.text === newQuestion.trim());
    if (existingQuestion) {
      alert('This question already exists!');
      return;
    }

    // Add the question first
    const newQuestionObj = createQuestion(newQuestion);
    setQuiz(prevQuiz => addQuestionToQuiz(prevQuiz, newQuestionObj));
    
    const questionText = newQuestion.trim();
    setNewQuestion('');
    
    // Then query AI providers for answers
    await queryAIProviders(questionText);
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
