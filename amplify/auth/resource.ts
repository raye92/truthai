import { defineAuth, secret } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'profile'],
        attributeMapping: {
          email: 'email',
          preferredUsername: 'name'
        }
      },
      // Sign In with Apple commented out - not using Apple developer account
      // signInWithApple: {
      //   clientId: secret('SIWA_CLIENT_ID'),
      //   keyId: secret('SIWA_KEY_ID'),
      //   privateKey: secret('SIWA_PRIVATE_KEY'),
      //   teamId: secret('SIWA_TEAM_ID'),
      //   scopes: ['email', 'name'],
      //   attributeMapping: {
      //     email: 'email',
      //     preferredUsername: 'name'
      //   }
      // },
      // facebook: {
      //   clientId: secret('FACEBOOK_CLIENT_ID'),
      //   clientSecret: secret('FACEBOOK_CLIENT_SECRET'),
      //   scopes: ['email', 'public_profile'],
      //   attributeMapping: {
      //     email: 'email',
      //     preferredUsername: 'name'
      //   }
      // },
      callbackUrls: [
        'http://localhost:5173/',
        'https://main.d3dzs5ykzgbon2.amplifyapp.com/',
        'https://www.curateai.app/',
        'https://ur-mom.dev/'
      ],
      logoutUrls: [
        'http://localhost:5173/',
        'https://main.d3dzs5ykzgbon2.amplifyapp.com/',
        'https://www.curateai.app/',
        'https://ur-mom.dev/'
      ]
    }
  },
  triggers: {
    postConfirmation
  }
});
