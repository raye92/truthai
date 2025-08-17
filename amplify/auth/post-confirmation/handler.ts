import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend-function/runtime';
import { env } from "$amplify/env/post-confirmation";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
    console.log('Post confirmation event:', JSON.stringify(event, null, 2));

    console.log('Creating new user with email:', event.request.userAttributes.email);
    await client.models.UserProfile.create({
        username: event.request.userAttributes.preferred_username || 'User',
        email: event.request.userAttributes.email,
        isNewUser: true,
        apiUsage: 0,
        role: 'USER'
    });

    console.log('Successfully processed user data');
    return event;
};
