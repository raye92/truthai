export interface Provider {
  name: string;
  url: string;
}

export interface Answer {
  answer: string;
  providers: Provider[];
  key?: string; // Optional key, will default to A, B, C, D... if not provided
}

export interface Question {
  text: string;
  answers: Answer[];
  totalProviders: number;
}

export interface Quiz {
  questions: Question[];
}
