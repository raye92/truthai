//======== CLEANUP ========
import { Quiz, Question, Answer } from './types';

export function createQuiz(): Quiz {
  return {
    questions: []
  };
}

export function createQuestion(text: string, questionNumber?: string | number): Question {
  return {
    text: text.trim(),
    answers: [],
    totalProviders: 0,
    questionNumber,
  };
}

export function createAnswer(answer: string, provider?: string): Answer {
  return {
    answer: answer.trim(),
    providers: provider ? [provider] : []
  };
}

/**
 * Adds a provider to an existing answer
 */
export function addProviderToAnswer(answer: Answer, provider: string): Answer {
  const providerExists = answer.providers.includes(provider);
  if (!providerExists) {
    return {
      ...answer,
      providers: [...answer.providers, provider]
    };
  }
  return answer;
}

/**
 * Updates a question's total provider count
 */
export function updateQuestionProviderCount(question: Question): Question {
  const totalProviders = question.answers.reduce((total, answer) => {
    return total + answer.providers.length;
  }, 0);
  
  return {
    ...question,
    totalProviders
  };
}

/**
 * Adds an answer to a question
 */
export function addAnswerToQuestion(question: Question, answer: Answer): Question {
  const existingAnswer = question.answers.find(a => a.answer === answer.answer);
  
  if (existingAnswer) {
    // Merge providers if answer already exists
    const updatedAnswers = question.answers.map(existing => 
      existing.answer === answer.answer
        ? answer.providers.reduce((acc, provider) => addProviderToAnswer(acc, provider), existing)
        : existing
    );
    
    return updateQuestionProviderCount({
      ...question,
      answers: updatedAnswers
    });
  } else {
    // Add new answer
    return updateQuestionProviderCount({
      ...question,
      answers: [...question.answers, answer]
    });
  }
}

/**
 * Adds a question to a quiz
 */
export function addQuestionToQuiz(quiz: Quiz, question: Question): Quiz {
  return {
    ...quiz,
    questions: [...quiz.questions, question]
  };
}

/**
 * Updates a question in a quiz at the specified index
 */
export function updateQuestionInQuiz(quiz: Quiz, questionIndex: number, updatedQuestion: Question): Quiz {
  const newQuestions = [...quiz.questions];
  newQuestions[questionIndex] = updatedQuestion;
  
  return {
    ...quiz,
    questions: newQuestions
  };
}

/**
 * Reassigns the key of an answer at the specified index.
 */
export function changeAnswerKey(answers: Answer[], answerIndex: number, newKey: string): Answer[] {
  const upperKey = newKey.toUpperCase();
  return answers.map((answer, index) => index === answerIndex ? { ...answer, key: upperKey } : answer);
}

//======== CLEANUP ========