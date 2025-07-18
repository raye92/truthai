import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";


const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  try {
    console.log('Post confirmation event:', JSON.stringify(event, null, 2));
    
    // Check if user already exists
    const { data: existingUsers } = await client.models.User.list({
      filter: { email: { eq: event.request.userAttributes.email } }
    });

    if (existingUsers.length > 0) {
      // Update existing user
      console.log('Updating existing user:', existingUsers[0].id);
      await client.models.User.update({
        id: existingUsers[0].id,
        username: event.request.userAttributes.preferred_username || 
                event.request.userAttributes.name || 
                event.userName,
        email: event.request.userAttributes.email,
        // Set isNewUser to false since this is an existing user
        isNewUser: false
      });
    } else {
      // Create new user
      console.log('Creating new user with email:', event.request.userAttributes.email);
      await client.models.User.create({
        username: event.request.userAttributes.preferred_username || 
                event.request.userAttributes.name || 
                event.userName,
        email: event.request.userAttributes.email,
        // Set as new user
        isNewUser: true,
        // Set profile picture if available from OAuth provider
        profilePicture: event.request.userAttributes.picture || '',
        // Initialize other fields
        apiUsage: 0,
        role: 'USER'
      });
    }
    
    console.log('Successfully processed user data');
    return event;
  } catch (error) {
    console.error('Error in post confirmation handler:', error);
    // Still return the event even if there's an error to not block the authentication flow
    return event;
  }
};
