import type { Schema } from '../../data/resource';
import { GoogleGenAI } from "@google/genai";

export const handler: Schema['promptGemini']['functionHandler'] = async (event, context) => {
    const { prompt, useGrounding = false } = event.arguments;
    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      throw new Error("⛔️ `prompt` must be a nonempty string");
    }

    const ai = new GoogleGenAI({});

    // Configure generation settings based on whether grounding is requested
    let config: any = {
        thinkingConfig: {
            thinkingBudget: -1 // Disables thinking
        }
    };
    if (useGrounding) {
        const groundingTool = {
            googleSearch: {},
        };
        config = {
            ...config,
            tools: [groundingTool],
        };
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config,
    });

    return response.text ?? null;
};
