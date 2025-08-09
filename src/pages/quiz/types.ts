export interface LayoutChoice { key: string; text: string }
export interface LayoutItem { question: string; questionNumber: string | number; choices: LayoutChoice[] }

// Interface for layout items without keys in choices (for AI provider queries)
export interface LayoutItemWithoutKeys { 
  question: string; 
  questionNumber: string | number; 
  choices: { text: string }[] 
}


