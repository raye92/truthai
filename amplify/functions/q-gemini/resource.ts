import { defineFunction, secret } from '@aws-amplify/backend';

export const promptGemini = defineFunction({
  name: 'promptGemini',
  environment: {
    GEMINI_API_KEY: secret('GEMINI_API_KEY')
  },
  entry: './handler.ts',
  timeoutSeconds: 30,
});
