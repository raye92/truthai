import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  // State to hold the GPT response
  const [gptResponse, setGptResponse] = useState<string>("");
  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    client.queries.promptGpt({ prompt: "Hello, how are you?" })
      .then((results) => {
        console.log("Fullzzzz promptGpt response:", results);
        console.log("promptGpt data:", results.data);
        setGptResponse(results.data ?? "");
      })
      .catch((err) => {
        console.error("promptGpt error:", err);
        console.error("Error details:", JSON.stringify(err, null, 2));
        setGptResponse("Error fetching GPT response");
    });
    console.log("DONE")
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }
  
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todo</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li 
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>
          {todo.content}</li>
        ))}
      </ul>

      <div style={{ marginTop: 24 }}>
        <strong>GPT says:</strong> {gptResponse}
      </div>

      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
