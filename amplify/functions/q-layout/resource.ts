import { defineFunction, secret } from '@aws-amplify/backend';

export const promptLayout = defineFunction({
  name: 'promptLayout',
  environment: {
    GEMINI_API_KEY: secret('GEMINI_API_KEY')
  },
  entry: './handler.ts',
  timeoutSeconds: 30,
}); 