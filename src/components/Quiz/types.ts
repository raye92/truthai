export interface Answer {
  answer: string;
  providers: string[];
  key?: string; // Optional key, will default to A, B, C, D... if not provided
}

export interface Question {
  text: string;
  answers: Answer[];
  totalProviders: number;
  questionNumber?: string | number;
}

export interface Quiz {
  questions: Question[];
}
