//======== AI SLOP ========
import { Quiz, Question, Answer } from './types';

export function createQuiz(): Quiz {
  return {
    questions: []
  };
}

export function createQuestion(text: string): Question {
  return {
    text: text.trim(),
    answers: [],
    totalProviders: 0
  };
}

export function createAnswer(answer: string, provider: string): Answer {
  return {
    answer: answer.trim(),
    providers: [provider]
  };
}


export function createProvider(name: string): string {
  return name;
}

/**
 * Creates a new Answer with multiple providers
 */
export function createAnswerWithProviders(answer: string, providers: string[]): Answer {
  return {
    answer: answer.trim(),
    providers: [...providers]
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
 * Adds multiple providers to an existing answer
 */
export function addProvidersToAnswer(answer: Answer, providers: string[]): Answer {
  let updatedAnswer = { ...answer };
  
  for (const provider of providers) {
    updatedAnswer = addProviderToAnswer(updatedAnswer, provider);
  }
  
  return updatedAnswer;
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
        ? addProvidersToAnswer(existing, answer.providers)
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
//======== AI SLOP ========