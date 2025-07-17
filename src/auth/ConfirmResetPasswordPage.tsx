import React from 'react';
import { useForm } from 'react-hook-form';
import { confirmResetPassword } from 'aws-amplify/auth';
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

interface ConfirmResetPasswordFormData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

interface ConfirmResetPasswordPageProps {
  onNavigate: (page: string) => void;
  email?: string;
}

export function ConfirmResetPasswordPage({ onNavigate, email: initialEmail }: ConfirmResetPasswordPageProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const [successMessage, setSuccessMessage] = React.useState<string>('');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ConfirmResetPasswordFormData>({
    defaultValues: {
      email: initialEmail || ''
    }
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ConfirmResetPasswordFormData) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await confirmResetPassword({
        username: data.email,
        confirmationCode: data.code,
        newPassword: data.newPassword
      });
      setSuccessMessage('Password reset successfully! Redirecting to sign in...');
      setTimeout(() => {
        onNavigate('signIn');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LogoHeader />
      <ViewContainer>
        <ViewHeader>Set New Password</ViewHeader>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
          Enter the code we sent to your email and your new password
        </p>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <ViewSection>
            <TextField<ConfirmResetPasswordFormData>
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

            <TextField<ConfirmResetPasswordFormData>
              control={control}
              name="code"
              type="text"
              label="Reset Code"
              placeholder="Enter the 6-digit code"
              rules={{
                required: 'Reset code is required',
                pattern: {
                  value: /^\d{6}$/,
                  message: 'Code must be 6 digits'
                }
              }}
              error={errors.code?.message}
            />

            <TextField<ConfirmResetPasswordFormData>
              control={control}
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              rules={{
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message: 'Password must contain uppercase, lowercase, number and special character'
                }
              }}
              error={errors.newPassword?.message}
            />

            <TextField<ConfirmResetPasswordFormData>
              control={control}
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              rules={{
                required: 'Please confirm your new password',
                validate: (value) => value === newPassword || 'Passwords do not match'
              }}
              error={errors.confirmPassword?.message}
            />
          </ViewSection>

          <SubmitButton type="submit" loading={isLoading}>
            Reset Password
          </SubmitButton>
        </form>

        <ErrorMessage>{error}</ErrorMessage>

        <LinksContainer>
          <LinkButton
            type="button"
            onClick={() => onNavigate('forgotPassword')}
          >
            Resend Code
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
