import type { Schema } from '../../data/resource';
import { GoogleGenAI } from "@google/genai";

export const handler: Schema['promptLayout']['functionHandler'] = async (event, context) => {
    const { prompt } = event.arguments;
    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      throw new Error("⛔️ `prompt` must be a nonempty string");
    }

    const ai = new GoogleGenAI({});

    // Hardcoded instruction prompt
    const instructionPrompt = `
        # Identity
        You are a text extraction model. Convert raw text containing questions and multiple-choice answers into a structured JSON format.

        # Input:
        A single block of unstructured text with questions and answers. Choices may or may not be present, and choices may have various key styling. 

        # Output:
        A single JSON array of objects. Each object represents a question and must include:
        "question": The question text. Use "No question provided" if absent.
        "questionNumber": The question number as a string, or sequential numbers starting from "1" if not provided.
        "choices": An array (empty if no choices) of choice objects each containing:
        "key": The choice key, normalized to an uppercase letter (e.g., "A"). Assign sequentially if missing.
        "text": The exact choice text.

        # Examples
        <question id="standard-and-alphabetical-keys">
        1. What is the capital of France?
        A) London
        B) Berlin
        C) Paris

        2. Which of the following are primary colors?
        C) Red
        A) Green
        B) Blue
        </question>

        <assistant_response id="standard-and-non-alphabetical-keys">
        [
        {
            "question": "What is the capital of France?",
            "questionNumber": "1",
            "choices": [
            { "key": "A", "text": "London" },
            { "key": "B", "text": "Berlin" },
            { "key": "C", "text": "Paris" }
            ]
        },
        {
            "question": "Which of the following are primary colors?",
            "questionNumber": "2",
            "choices": [
            { "key": "C", "text": "Red" },
            { "key": "A", "text": "Green" },
            { "key": "B", "text": "Blue" }
            ]
        }
        ]
        </assistant_response>

        <question id="missing-numbers-and-keys">
        Which of the following is a mammal?
        - Dolphin
        - Shark

        Question 5:
        i) Lion
        ii) Tiger
        </question>

        <assistant_response id="missing-numbers-and-keys">
        [
        {
            "question": "Which of the following is a mammal?",
            "questionNumber": "1",
            "choices": [
            { "key": "A", "text": "Dolphin" },
            { "key": "B", "text": "Shark" }
            ]
        },
        {
            "question": "Question 5:",
            "questionNumber": "5",
            "choices": [
            { "key": "A", "text": "Lion" },
            { "key": "B", "text": "Tiger" }
            ]
        }
        ]
        </assistant_response>

        <question id="no-choices-present">
        Q9. Describe the process of photosynthesis.

        What is the square root of 144?
        </question>

        <assistant_response id="no-choices-present">
        [
        {
            "question": "Describe the process of photosynthesis.",
            "questionNumber": "9",
            "choices": []
        },
        {
            "question": "What is the square root of 144?",
            "questionNumber": "10",
            "choices": []
        }
        ]
        </assistant_response>`;
    
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