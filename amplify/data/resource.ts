import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { testTickle } from '../functions/test/resource';
import { promptGpt } from '../functions/q-openai/resource';
import { promptGemini } from '../functions/q-gemini/resource';
import { promptLayout } from '../functions/q-layout/resource';
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a.schema({
  UserProfile: a
    .model({
      email: a.string().required(),
      profileOwner: a.string().required(),
      username: a.string().required().default("User"),
      profilePicture: a.string(),
      preferences: a.json(),
      apiUsage: a.integer().default(0),
      lastActive: a.datetime(),
      role: a.string().required().default('USER'),
      isNewUser: a.boolean().default(true),

      conversations: a.hasMany('Conversation', 'userId')
    })
    .authorization((allow: any) => [
      allow.ownerDefinedIn("profileOwner"),
    ]),
  
  Conversation: a.model({
    id: a.id().required(),
    title: a.string().required(),
    userId: a.string().required(),
    isSaved: a.boolean().default(false),

    user: a.belongsTo('UserProfile', 'userId'),
    messages: a.hasMany('Message', 'conversationId'),
  }).authorization(
    (allow: any) => [
      allow.ownerDefinedIn("userId"),
    ]
  ),
  
  Message: a.model({
    id: a.id().required(),
    conversationId: a.string().required(),
    role: a.string().required(),
    content: a.string().required(),
    metadata: a.json(),

    conversation: a.belongsTo('Conversation', 'conversationId'),
  }).authorization(
    (allow: any) => [
      allow.ownerDefinedIn("conversation.userId"),
    ]
  ),
  
  promptGpt: a 
    .query()
    .arguments({
      prompt: a.string(),
    })
    .returns(a.string())
    .authorization((allow: any) => [allow.publicApiKey()])
    .handler(a.handler.function(promptGpt)),
  promptGemini: a 
    .query()
    .arguments({
      prompt: a.string(),
      useGrounding: a.boolean(),
    })
    .returns(a.string())
    .authorization((allow: any) => [allow.publicApiKey()])
    .handler(a.handler.function(promptGemini)),
  promptLayout: a 
    .query()
    .arguments({
      prompt: a.string(),
    })
    .returns(a.string())
    .authorization((allow: any) => [allow.publicApiKey()])
    .handler(a.handler.function(promptLayout)),
  testMonkey: a
    .query()
    .arguments({  name: a.string()  })
    .returns(a.string())
    .authorization((allow: any) => [allow.publicApiKey()])
    .handler(a.handler.function(testTickle))
})
.authorization((allow: any) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
