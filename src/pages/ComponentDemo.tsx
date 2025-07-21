// ======== TESTING ========
import { useState } from "react";
import { Quiz } from "../components/Quiz/Quiz";
import { generateSampleProviders } from "../components/Quiz/ProviderCard";
import { Quiz as QuizType, Question, Answer } from "../components/Quiz/types";
import "./ComponentDemo.css";

export function ComponentDemo() {
  const [quiz, setQuiz] = useState<QuizType>({
    questions: [
      {
        text: "What is the best programming language for web development?",
        totalProviders: 0,
        answers: [
          { answer: "Choice A - JavaScript", providers: [] },
          { answer: "Choice B - Python", providers: [] },
          { answer: "Choice C - TypeScript", providers: [] },
          { answer: "Choice D - Go", providers: [] },
        ],
      },
    ],
  });

  const addRandomVote = (questionIndex: number, answerIndex: number) => {
    const providerCount = Math.floor(Math.random() * 5) + 1; // 1-5 random providers
    const newProviders = generateSampleProviders(providerCount);
    
    setQuiz(prevQuiz => {
      const newQuiz = { ...prevQuiz };
      newQuiz.questions = [...prevQuiz.questions];
      newQuiz.questions[questionIndex] = {
        ...prevQuiz.questions[questionIndex],
        answers: [...prevQuiz.questions[questionIndex].answers],
      };
      
      // Add providers to the specific answer
      newQuiz.questions[questionIndex].answers[answerIndex] = {
        ...newQuiz.questions[questionIndex].answers[answerIndex],
        providers: [
          ...newQuiz.questions[questionIndex].answers[answerIndex].providers,
          ...newProviders,
        ],
      };
      
      // Recalculate total providers for the question
      newQuiz.questions[questionIndex].totalProviders = newQuiz.questions[questionIndex].answers.reduce(
        (total, answer) => total + answer.providers.length,
        0
      );
      
      return newQuiz;
    });
  };

  const resetVotes = () => {
    setQuiz(prevQuiz => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map(question => ({
        ...question,
        totalProviders: 0,
        answers: question.answers.map(answer => ({
          ...answer,
          providers: [],
        })),
      })),
    }));
  };

  return (
    <div className="component-demo-container">
      <div className="component-demo-header">
        <h1 className="demo-title">Quiz Component Demo</h1>
        <p className="demo-description">
          Test the quiz component with interactive voting buttons
        </p>
      </div>
      
      <div className="demo-controls">
        <h3>Test Voting Controls</h3>
        <div className="voting-buttons">
          {quiz.questions[0].answers.map((answer, answerIndex) => (
            <button
              key={answerIndex}
              className="vote-button"
              onClick={() => addRandomVote(0, answerIndex)}
            >
              Vote for {answer.answer.split(' - ')[0]}
            </button>
          ))}
        </div>
        <button className="reset-button" onClick={resetVotes}>
          Reset All Votes
        </button>
      </div>

      <div className="quiz-container">
        <Quiz quiz={quiz} />
      </div>
    </div>
  );
}
