import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

import { testTickle } from './functions/test/resource';

defineBackend({
  auth,
  data,
  testTickle,
});
