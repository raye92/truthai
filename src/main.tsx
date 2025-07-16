import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { CustomAuthenticator } from './auth';
import App from "./App.tsx";
import "./index.css";
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

function AuthWrapper() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === 'authenticated') {
    return <App />;
  }

  return <CustomAuthenticator />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <AuthWrapper />
    </Authenticator.Provider>
  </React.StrictMode>
);
