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
        You are a text extraction model. Convert raw text containing questions and multiple-choice answers into a structured separate questions and choices in JSON format.

        # Input:
        Text with questions and answers. One or many questions may be present. Choices may or may not be present, and choices may have various key styling. 

        # Output:
        A single JSON array of objects. Each object represents a question and must include:
        "question": The question text. Use "No question provided" if absent.
        "questionNumber": The question number as a string, or if not provided, assign it by continuing sequentially from the last known number across the entire input (starting from "1" if no numbers have been seen yet).
        "choices": An array (empty if no choices) of choice objects each containing:
        "key": Existing Keys: (e.g., a), x., II), it is extracted into text equivalent (a, x, II). The original association between the key and its text is always maintained.
        Missing Keys: If a choice has no key, a sequential uppercase letter (A, B, C...) is assigned to it.
        "text": The choice text.

        # Examples
        <question id="alphabetical-in-order">
        1. What is the capital of France?
        a) London
        b) Berlin
        c) Paris
        </question>

        <assistant_response id="alphabetical-in-order">
        [
        {
            "question": "What is the capital of France?",
            "questionNumber": 1,
            "choices": [
            { "key": "a", "text": "London" },
            { "key": "b", "text": "Berlin" },
            { "key": "c", "text": "Paris" }
            ]
        }
        ]
        </assistant_response>

        <question id="out-of-order-alphabetical">
        2. Which of the following are primary colors?
        C) Red
        A) Green
        B) Blue
        </question>

        <assistant_response id="out-of-order-alphabetical">
        [
        {
            "question": "Which of the following are primary colors?",
            "questionNumber": 2,
            "choices": [
            { "key": "C", "text": "Red" },
            { "key": "A", "text": "Green" },
            { "key": "B", "text": "Blue" }
            ]
        }
        ]
        </assistant_response>

        <question id="missing-numbers">
        Which of the following is a mammal?
        - Dolphin
        - Shark
        </question>

        <assistant_response id="missing-numbers">
        [
        {
            "question": "Which of the following is a mammal?",
            "questionNumber": 1,
            "choices": [
            { "key": "A", "text": "Dolphin" },
            { "key": "B", "text": "Shark" }
            ]
        }
        ]
        </assistant_response>

        <question id="no-question">
        Question 5:
        i) Lion
        ii) Tiger
        </question>

        <assistant_response id="no-question">
        [
        {
            "question": "No question provided",
            "questionNumber": 5,
            "choices": [
            { "key": "i", "text": "Lion" },
            { "key": "ii", "text": "Tiger" }
            ]
        }
        ]
        </assistant_response>

        <question id="multiple-no-choices">
        Q9. Describe the process of photosynthesis.

        What is the square root of 144?
        </question>

        <assistant_response id="multiple-no-choices">
        [
        {
            "question": "Describe the process of photosynthesis.",
            "questionNumber": 9,
            "choices": []
        },
        {
            "question": "What is the square root of 144?",
            "questionNumber": 10,
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