import { defineFunction, secret } from '@aws-amplify/backend';

export const createCheckoutSession = defineFunction({
  name: 'createCheckoutSession',
  entry: './handler.ts',
  environment: {
    STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
    // Set these in Amplify function environment configuration
    PRICE_ID: 'price_1S2d5jRxuH96HMkzF23EO2vY',
    SUCCESS_URL: 'https://curateai.app/success',
    CANCEL_URL: 'https://curateai.app/cancel',
  },
  timeoutSeconds: 30,
});


