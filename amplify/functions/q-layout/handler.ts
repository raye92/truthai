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

        # Input
        Text with questions and answers. One or many questions may be present. Choices may or may not be present, and choices may have various key styling.

        # Output
        Return ONLY a JSON array. Each object represents a question and must include:
        - "question": The question text. Use "No question provided" if absent.
        - "questionNumber": The question number as a number. If not explicitly provided in the source text, assign it by continuing sequentially from the last known number across the entire input (starting from 1 if no numbers have been seen yet). Preserve explicit numbers if present (e.g., 5, 9, 10).
        - "choices": An array (empty if no choices) of choice objects each containing:
            - "key": If a key/prefix exists (e.g., a), b), C) x. i) II) 1.) retain its normalized textual form without trailing punctuation (a, b, C, x, i, II, 1). If a choice has no key, assign a sequential uppercase letter (A, B, C, ...). Do not renumber existing keys. Maintain original association between key and its text.
            - "text": The choice text trimmed of leading key markers and surrounding whitespace.
        Do not infer answers. Do not add extraneous fields. Do not wrap in code fences.

        # Examples

        Example 1 (numbered question, alphabetical choices in order)
        Input:
        1. What is the capital of France? a) London b) Berlin c) Paris
        Output:
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

        Example 2 (alphabetical but out of order in source; preserve given keys)
        Input:
        2. Which of the following are primary colors? 
        C) Red
        A) Green
        B) Blue
        Output:
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

        Example 3 (no explicit question number; assign starting at 1; dash bullets with no keys -> assign A, B)
        Input:
        Which of the following is a mammal?
        - Dolphin
        - Shark
        Output:
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

        Example 4 (labeled question without text; roman numeral keys)
        Input:
        Question 5:
        i) Lion
        ii) Tiger
        Output:
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

        Example 5 (multiple questions, one numbered, next unnumbered -> continue numbering)
        Input:
        Q9. Describe the process of photosynthesis.\n
        What is the square root of 144?
        Output:
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
        ]`;
    
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