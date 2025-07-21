export interface Provider {
  name: string;
  url: string;
}

export interface Answer {
  answer: string;
  providers: Provider[];
}

export interface Question {
  text: string;
  answers: Answer[];
  totalProviders: number;
}

export interface Quiz {
  questions: Question[];
}
