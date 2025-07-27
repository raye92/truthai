import { useState } from 'react';
import { Quiz } from '../components/Quiz/Quiz';
import { Quiz as QuizType, Question as QuizQuestion, Answer as QuizAnswer } from '../components/Quiz/types';
import { generateSampleProviders } from '../components/Quiz/ProviderCard';
import './QuizPage.css';

export function QuizPage() {
  const [quiz, setQuiz] = useState<QuizType>({ questions: [] });
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    
    const existingQuestion = quiz.questions.find(q => q.text === newQuestion.trim());
    if (existingQuestion) {
      alert('This question already exists!');
      return;
    }

    setQuiz(prevQuiz => ({
      ...prevQuiz,
      questions: [
        ...prevQuiz.questions,
        { text: newQuestion.trim(), answers: [], totalProviders: 0 }
      ]
    }));
    setNewQuestion('');
  };

  const handleAddAnswer = () => {
    if (!newAnswer.trim() || selectedQuestionIndex === null) return;

    const question = quiz.questions[selectedQuestionIndex];
    const existingAnswer = question.answers.find(a => a.answer === newAnswer.trim());
    
    if (existingAnswer) {
      // Add a provider to existing answer
      const allProviders = generateSampleProviders(10);
      const availableProviders = allProviders.filter(p => 
        !existingAnswer.providers.some(ep => ep.name === p.name)
      );
      
      if (availableProviders.length === 0) {
        alert('All providers have already voted for this answer!');
        return;
      }

      const randomProvider = availableProviders[Math.floor(Math.random() * availableProviders.length)];
      
      setQuiz(prevQuiz => {
        const newQuestions = [...prevQuiz.questions];
        const questionToUpdate = { ...newQuestions[selectedQuestionIndex] };
        const answerIndex = questionToUpdate.answers.findIndex(a => a.answer === newAnswer.trim());
        
        questionToUpdate.answers = questionToUpdate.answers.map((answer, idx) => 
          idx === answerIndex 
            ? { ...answer, providers: [...answer.providers, randomProvider] }
            : answer
        );
        questionToUpdate.totalProviders += 1;
        newQuestions[selectedQuestionIndex] = questionToUpdate;
        
        return { ...prevQuiz, questions: newQuestions };
      });
    } else {
      // Create new answer
      const allProviders = generateSampleProviders(10);
      const randomProvider = allProviders[Math.floor(Math.random() * allProviders.length)];
      
      setQuiz(prevQuiz => {
        const newQuestions = [...prevQuiz.questions];
        const questionToUpdate = { ...newQuestions[selectedQuestionIndex] };
        
        questionToUpdate.answers = [
          ...questionToUpdate.answers,
          { answer: newAnswer.trim(), providers: [randomProvider] }
        ];
        questionToUpdate.totalProviders += 1;
        newQuestions[selectedQuestionIndex] = questionToUpdate;
        
        return { ...prevQuiz, questions: newQuestions };
      });
    }
    
    setNewAnswer('');
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
            />
            <button onClick={handleAddQuestion} className="add-question-btn">
              Add Question
            </button>
          </div>

          {/* ======== TESTING ======== */}
          {quiz.questions.length > 0 && (
            <div className="add-answer-section">
              <div>
                <h4> </h4>
              </div>
              <div className="answer-input-group">
                <select
                  value={selectedQuestionIndex ?? ''}
                  onChange={(e) => setSelectedQuestionIndex(e.target.value ? parseInt(e.target.value) : null)}
                  className="question-select"
                >
                  <option value="">Select a question...</option>
                  {quiz.questions.map((question, index) => (
                    <option key={index} value={index}>
                      Q{index + 1}: {question.text}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Enter an answer..."
                  className="answer-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAnswer()}
                  disabled={selectedQuestionIndex === null}
                />
                <button 
                  onClick={handleAddAnswer} 
                  className="add-answer-btn"
                  disabled={selectedQuestionIndex === null}
                >
                  Add Answer
                </button>
              </div>
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
