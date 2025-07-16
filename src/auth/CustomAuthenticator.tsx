import React from 'react';
import { SignInPage } from './SignInPage';
import { SignUpPage } from './SignUpPage';
import { ConfirmEmailPage } from './ConfirmEmailPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { ConfirmResetPasswordPage } from './ConfirmResetPasswordPage';

type AuthPage = 'signIn' | 'signUp' | 'confirmEmail' | 'forgotPassword' | 'confirmResetPassword';

interface AuthRouterState {
  currentPage: AuthPage;
  data?: any;
}

export function CustomAuthenticator() {
  const [authState, setAuthState] = React.useState<AuthRouterState>({
    currentPage: 'signIn'
  });

  const handleNavigate = (page: AuthPage, data?: any) => {
    setAuthState({ currentPage: page, data });
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
            email={authState.data?.email}
          />
        );
      case 'forgotPassword':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case 'confirmResetPassword':
        return (
          <ConfirmResetPasswordPage 
            onNavigate={handleNavigate}
            email={authState.data?.email}
          />
        );
      default:
        return <SignInPage onNavigate={handleNavigate} />;
    }
  };

  return renderCurrentPage();
}
