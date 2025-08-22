import React from 'react';
import { SignInPage } from './SignInPage';
import { SignUpPage } from './SignUpPage';
import { ConfirmEmailPage } from './ConfirmEmailPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { ConfirmResetPasswordPage } from './ConfirmResetPasswordPage';

interface AuthRouterState {
  currentPage: string;
}

export function CustomAuthenticator() {
  const [authState, setAuthState] = React.useState<AuthRouterState>({
    currentPage: 'signIn'
  });

  const handleNavigate = (page: string) => {
    setAuthState({ currentPage: page });
  };

  const renderCurrentPage = () => {
    switch (authState.currentPage) {
      case 'signIn':
        return <SignInPage onNavigate={handleNavigate} />;
      case 'signUp':
        return <SignUpPage onNavigate={handleNavigate} />;
      case 'confirmEmail':
        return (
          <ConfirmEmailPage 
            onNavigate={handleNavigate}
          />
        );
      case 'forgotPassword':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case 'confirmResetPassword':
        return (
          <ConfirmResetPasswordPage 
            onNavigate={handleNavigate}
          />
        );
      default:
        return <SignInPage onNavigate={handleNavigate} />;
    }
  };

  return renderCurrentPage();
}
