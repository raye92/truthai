import { defineFunction, secret } from '@aws-amplify/backend';

export const promptGpt = defineFunction({
  name: 'promptGpt',
  environment: {
    OPENAI_API_KEY: secret('OPENAI_API_KEY')
  },
  entry: './handler.ts',
  timeoutSeconds: 30,
});