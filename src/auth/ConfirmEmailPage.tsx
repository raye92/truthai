import React from 'react';
import { useForm } from 'react-hook-form';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import {
  Container,
  ViewContainer,
  ViewHeader,
  ViewSection,
  TextField,
  SubmitButton,
  LinksContainer,
  LinkButton,
  ErrorMessage,
  LogoHeader
} from './components';
import './auth.css';

interface ConfirmEmailFormData {
  email: string;
  code: string;
}

interface ConfirmEmailPageProps {
  onNavigate: (page: string) => void;
  email?: string;
}

export function ConfirmEmailPage({ onNavigate, email: initialEmail }: ConfirmEmailPageProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const [successMessage, setSuccessMessage] = React.useState<string>('');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ConfirmEmailFormData>({
    defaultValues: {
      email: initialEmail || ''
    }
  });

  const email = watch('email');

  const onSubmit = async (data: ConfirmEmailFormData) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await confirmSignUp({
        username: data.email,
        confirmationCode: data.code
      });
      onNavigate('signIn');
    } catch (err: any) {
      setError(err.message || 'An error occurred during email confirmation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsResending(true);
    setError('');
    setSuccessMessage('');

    try {
      await resendSignUpCode({
        username: email
      });
      setSuccessMessage('Confirmation code sent to your email');
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Container>
      <LogoHeader />
      <ViewContainer>
        <ViewHeader>Confirm Your Email</ViewHeader>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
          We've sent a confirmation code to your email address
        </p>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <ViewSection>
            <TextField<ConfirmEmailFormData>
              control={control}
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              }}
              error={errors.email?.message}
            />

            <TextField<ConfirmEmailFormData>
              control={control}
              name="code"
              type="text"
              label="Confirmation Code"
              placeholder="Enter the 6-digit code"
              rules={{
                required: 'Confirmation code is required',
                pattern: {
                  value: /^\d{6}$/,
                  message: 'Code must be 6 digits'
                }
              }}
              error={errors.code?.message}
            />
          </ViewSection>

          <SubmitButton type="submit" loading={isLoading}>
            Confirm Email
          </SubmitButton>
        </form>

        <ErrorMessage>{error}</ErrorMessage>

        <LinksContainer>
          <LinkButton
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend Code'}
          </LinkButton>
          <LinkButton
            type="button"
            onClick={() => onNavigate('signIn')}
          >
            Back to Sign In
          </LinkButton>
        </LinksContainer>
      </ViewContainer>
    </Container>
  );
}
