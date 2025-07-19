import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { testTickle } from '../functions/test/resource';
import { promptGpt } from '../functions/q-openai/resource';
import { postConfirmation } from "../auth/post-confirmation/resource";
/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  User: a.model({
    id: a.id().required(),
    username: a.string().required().default("User"),
    email: a.string().required(),
    profilePicture: a.string(),
    preferences: a.json(),
    apiUsage: a.integer().default(0),
    lastActive: a.datetime(),
    role: a.string().required().default('USER'),
    isNewUser: a.boolean().default(false),
    conversations: a.hasMany('Conversation', 'userId')
  }).authorization(
    allow => [
      allow.owner(),
    ]
  ),
  
  Conversation: a.model({
    id: a.id().required(),
    title: a.string().required(),
    userId: a.string().required(),
    user: a.belongsTo('User', 'userId'),
    messages: a.hasMany('Message', 'conversationId'),
    createdAt: a.datetime().required(),
    updatedAt: a.datetime(),
    isArchived: a.boolean().default(false),
    metadata: a.json()
  }).authorization(
    allow => [
      allow.owner(),
    ]
  ),
  
  Message: a.model({
    id: a.id().required(),
    content: a.string().required(),
    conversationId: a.string().required(),
    conversation: a.belongsTo('Conversation', 'conversationId'),
    role: a.string().required(),
    createdAt: a.datetime().required(),
    tokens: a.integer(),
    metadata: a.json()
  }).authorization(
    allow => [
      allow.owner(),
    ]
  ),
  
  promptGpt: a 
    .query()
    .arguments({
      prompt: a.string(),
    })
    .returns(a.string())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(promptGpt)),
  testMonkey: a
    .query()
    .arguments({  name: a.string()  })
    .returns(a.string())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(testTickle))
});

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
