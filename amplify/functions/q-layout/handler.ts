import type { Schema } from '../../data/resource';
import { GoogleGenAI } from "@google/genai";

export const handler: Schema['promptLayout']['functionHandler'] = async (event, context) => {
    const { prompt } = event.arguments;
    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      throw new Error("⛔️ `prompt` must be a nonempty string");
    }

    const ai = new GoogleGenAI({});

    // Hardcoded instruction prompt
    const instructionPrompt = `Extract all questions and their answer choices from the input text. Return a JSON array of objects, each with:
        "question": The exact question text, or "No question provided" if choices appear without a question.
        "questionNumber": The given question number, or start numbering from 1 if no number is present.
        "choices": A list of choices in the format { "key": [uppercase letter], "text": [choice text] }.

        Instructions:
        Identify each question and its immediately following choices.
        Assign the question number, if not present start numbering from 1.
        Normalize all choice keys to uppercase letters (e.g., "A)", "a.", "(a)" → "A").
        If a choice lacks a key, assign one sequentially starting from "A".
        If choices appear without a preceding question, set "question": "No question provided".
        Each question may have zero or more choices.

        Output Format:
        {
        "question": "[Question text or 'No question provided']",
        "questionNumber": "[Question number or 'No question number provided']",
        "choices": [
            { "key": "A", "text": "[Choice text]" },
            { "key": "B", "text": "[Choice text]" }
        ]
        }
        Do not include explanations or wrap the JSON in code blocks. Output only the JSON array.`;
    const fullPrompt = `${instructionPrompt}\n\n${prompt}`;

    // Configure generation settings with thinking disabled
    const config = {
        thinkingConfig: {
            thinkingBudget: 0 // Disables thinking
        }
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: fullPrompt,
        config,
    });

    return response.text ?? null;
}; 