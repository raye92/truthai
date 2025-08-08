import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { createAnswer, createQuestion, addAnswerToQuestion, addQuestionToQuiz, updateQuestionInQuiz } from "../../components/Quiz/utils";
import type { Quiz as QuizType } from "../../components/Quiz/types";
import { stripCodeFences } from "../../utils/stringUtils";
import type { LayoutItem } from "./types.ts";

const client = generateClient<Schema>();

export const INSTRUCTION_PROMPT = `# Identity
    You are a helpful quiz-taking assistant that reads JSON question payloads and replies strictly in JSON.

    # Input format
    - The content between <question> and </question> will be either a single JSON object or an array of JSON objects.
    - Each object has the shape: { "question": string, "questionNumber": string, "choices": Array<{ "key": string, "text": string }> }.
    - The "choices" array may be empty when the question has no provided options.

    # Output format
    - Output only a single JSON object.
    - Use each question's "questionNumber" as the key (as a string).
    - If "choices" is empty: return a concise free-form answer string.
    - If exactly one choice is correct: return the chosen choice TEXT (not the key).
    - If multiple choices are correct: return an array of the chosen choice TEXT strings.
    - Do not include explanations or any extra formatting.`;

// Fetch raw layout string from backend
export const runLayoutPrompt = async (promptText: string): Promise<string> => {
  try {
    const result = await client.queries.promptLayout({ prompt: promptText });
    if (!result || result.errors) {
      console.error('Layout prompt error:', result?.errors);
      return '';
    }
    const raw = (result.data ?? '').trim();
    return raw;
  } catch (err) {
    console.error('Layout prompt exception:', err);
    return '';
  }
};

// Parse raw layout string into structured items for UI
export const parseLayoutPrompt = (rawLayout: string): LayoutItem[] => {
  if (!rawLayout) return [];
  const cleaned = stripCodeFences(rawLayout);
  try {
    const json = JSON.parse(cleaned);
    return Array.isArray(json) ? json : [json];
  } catch (err) {
    console.error('Failed to parse layout JSON:', err, cleaned);
    return [];
  }
};

// Query AI providers and map responses back into quiz state
export const queryAIProviders = async (
  layoutJsonString: string,
  questionTextMap: Record<string, string>,
  setQuiz: React.Dispatch<React.SetStateAction<QuizType>>,
  setIsGeneratingAnswers: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const fullPrompt = `${INSTRUCTION_PROMPT}\n\n<question id="user">\n${layoutJsonString}\n</question>`;

  const providers = [
    "GPT",
    "Gemini",
    "Gemini Google Grounded"
  ];

  const queryProvider = async (provider: string) => {
    try {
      let result: any;
      if (provider === "GPT") {
        result = await client.queries.promptGpt({ prompt: fullPrompt });
      } else if (provider === "Gemini") {
        result = await client.queries.promptGemini({ prompt: fullPrompt, useGrounding: false });
      } else if (provider === "Gemini Google Grounded") {
        result = await client.queries.promptGemini({ prompt: fullPrompt, useGrounding: true });
      }

      if (result && !result.errors && result.data && result.data.trim()) {
        const response = result.data.trim();
        const cleanedResponse = stripCodeFences(response);

        let answersByQuestion: Record<string, unknown> = {};
        try {
          const parsed = JSON.parse(cleanedResponse);
          if (parsed && typeof parsed === 'object') {
            answersByQuestion = parsed as Record<string, unknown>;
          }
        } catch (err) {
          console.error(`Failed to parse provider ${provider} JSON:`, err, cleanedResponse);
          return;
        }

        for (const [questionNumberKeyRaw, value] of Object.entries(answersByQuestion)) {
          const questionNumberKey = String(questionNumberKeyRaw);
          const questionText = questionTextMap[questionNumberKey] || '';
          if (!questionText) continue;

          const addAnswerTextToQuestion = (answerText: string) => {
            const trimmed = String(answerText).trim();
            if (!trimmed) return;
            setQuiz(prevQuiz => {
              const questionIndex = prevQuiz.questions.findIndex(q => q.text === questionText);
              if (questionIndex < 0) return prevQuiz;
              const questionToUpdate = prevQuiz.questions[questionIndex];
              const answerToAdd = createAnswer(trimmed, provider);
              const updatedQuestion = addAnswerToQuestion(questionToUpdate, answerToAdd);
              return updateQuestionInQuiz(prevQuiz, questionIndex, updatedQuestion);
            });
          };

        if (Array.isArray(value)) {
            for (const choiceText of value) {
              addAnswerTextToQuestion(String(choiceText));
            }
          } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            addAnswerTextToQuestion(String(value));
          } else if (value && typeof value === 'object') {
            const maybeText = (value as any).text ?? '';
            if (maybeText) addAnswerTextToQuestion(String(maybeText));
          }
        }
      } else {
        console.error(`Error from ${provider}:`, result?.errors);
      }
    } catch (error) {
      console.error(`Error querying ${provider}:`, error);
    }
  };

  const promises = providers.map((provider) => queryProvider(provider));
  try {
    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Error querying AI providers:', error);
  } finally {
    setIsGeneratingAnswers(false);
  }
};

// High-level handler for the Add Question flow
export const handleAddQuestion = async (
  newQuestion: string,
  quiz: QuizType,
  setQuiz: React.Dispatch<React.SetStateAction<QuizType>>,
  setNewQuestion: React.Dispatch<React.SetStateAction<string>>,
  setIsGeneratingAnswers: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const input = newQuestion.trim();
  if (!input) return;

  setIsGeneratingAnswers(true);

  const rawLayout = await runLayoutPrompt(input);
  let layoutItems = parseLayoutPrompt(rawLayout);
  console.log('Raw items:', rawLayout);
  let effectiveLayoutJson = rawLayout;
  if (layoutItems.length === 0) { // If no layout items, create a single question w/ original input
    effectiveLayoutJson = JSON.stringify([
        { question: input, questionNumber: 1, choices: [] }
    ]);
  }

  setNewQuestion('');

  const questionTextMap: Record<string, string> = {};
  for (const item of layoutItems) {
    const questionText = item.question !== 'No question provided' ? item.question : input;
    const questionNumberKey = String(item.questionNumber ?? '');
    if (questionNumberKey) {
      questionTextMap[questionNumberKey] = questionText;
    }

    if (quiz.questions.some((q) => q.text === questionText)) continue;

    let questionObj = createQuestion(questionText, item.questionNumber);
    for (const choice of item.choices) {
      let answerObj = createAnswer(choice.text);
      answerObj = { ...answerObj, key: choice.key.toUpperCase() };
      questionObj = addAnswerToQuestion(questionObj, answerObj);
    }

    setQuiz((prevQuiz) => addQuestionToQuiz(prevQuiz, questionObj));
  }

  if (layoutItems.length > 0) {
    await queryAIProviders(effectiveLayoutJson, questionTextMap, setQuiz, setIsGeneratingAnswers);
  }
};


