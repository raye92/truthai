import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();

  // State to hold the GPT response
  const [gptResponse, setGptResponse] = useState<string>("");
  useEffect(() => {
    client.queries.promptGpt({ prompt: "Explain a gay person" })
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

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s TruthAI</h1>

      <div style={{ marginTop: 24 }}>
        <strong>GPT says:</strong> {gptResponse}
      </div>

      <div>
        <br />
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
