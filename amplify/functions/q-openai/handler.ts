import type { Schema } from '../../data/resource';
import OpenAI from 'openai';

export const handler: Schema['promptGpt']['functionHandler'] = async (event, context) => {
    const { prompt } = event.arguments;
    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      throw new Error("⛔️ `prompt` must be a nonempty string");
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
        model: "gpt-5.1",
        input: prompt
    });

    return response.output_text;
};
