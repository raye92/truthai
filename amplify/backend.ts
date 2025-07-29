import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

import { testTickle } from './functions/test/resource';
import { promptGpt } from './functions/q-openai/resource';
import { promptGemini } from './functions/q-gemini/resource';

defineBackend({
  auth,
  data,
  testTickle,
  promptGpt,
  promptGemini,
});
