import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';

import { testTickle } from './functions/test/resource';
import { promptGpt } from './functions/q-openai/resource';
import { promptGemini } from './functions/q-gemini/resource';
import { promptLayout } from './functions/q-layout/resource';
import { createCheckoutSession } from './functions/createCheckoutSession/resource';
import { stripeWebhook } from './functions/stripeWebhook/resource';

const backend = defineBackend({
  auth,
  data,
  testTickle,
  promptGpt,
  promptGemini,
  promptLayout,
  createCheckoutSession,
  stripeWebhook,
});

// Create API Stack
const apiStack = backend.createStack('api-stack');

// Define REST API
const myRestApi = new RestApi(apiStack, 'RestApi', {
  restApiName: 'myRestApi',
  deploy: true,
  deployOptions: { stageName: 'dev' },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
});

// Integrations
const checkoutIntegration = new LambdaIntegration(backend.createCheckoutSession.resources.lambda);
const webhookIntegration = new LambdaIntegration(backend.stripeWebhook.resources.lambda);

// Auth: Cognito authorizer for protected routes
const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, 'CognitoAuth', {
  cognitoUserPools: [backend.auth.resources.userPool],
});

// Routes: protected create-checkout-session (Cognito)
const checkoutPath = myRestApi.root.addResource('create-checkout-session');
checkoutPath.addMethod('POST', checkoutIntegration, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth,
});

// Routes: public Stripe webhook (no auth)
const stripePath = myRestApi.root.addResource('stripe');
const webhookPath = stripePath.addResource('webhook');
webhookPath.addMethod('POST', webhookIntegration, {
  authorizationType: AuthorizationType.NONE,
});

// Optional IAM policy to allow app clients to call selected endpoints (if needed)
const apiRestPolicy = new Policy(apiStack, 'RestApiPolicy', {
  statements: [
    new PolicyStatement({
      actions: ['execute-api:Invoke'],
      resources: [
        `${myRestApi.arnForExecuteApi('*', '/create-checkout-session', 'dev')}`,
        `${myRestApi.arnForExecuteApi('*', '/stripe/webhook', 'dev')}`,
      ],
    }),
  ],
});

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiRestPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(apiRestPolicy);

// Output custom API data for Amplify client configuration
backend.addOutput({
  custom: {
    API: {
      [myRestApi.restApiName]: {
        endpoint: myRestApi.url,
        region: Stack.of(myRestApi).region,
        apiName: myRestApi.restApiName,
      },
    },
  },
});

export default backend;
