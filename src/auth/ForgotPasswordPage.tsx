import React from "react";
import { useForm } from "react-hook-form";
import { resetPassword } from "aws-amplify/auth";
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
  LogoHeader,
} from "./components";
import "./auth.css";

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await resetPassword({
        username: data.email,
      });
      setSuccessMessage("Password reset code sent to your email");
      // Navigate to confirm reset password page after a short delay
      setTimeout(() => {
        onNavigate("confirmResetPassword", { email: data.email });
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred while sending reset code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="forgot-password-page">
      <LogoHeader />
      <ViewContainer>
        <ViewHeader>Reset Password</ViewHeader>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "24px" }}>
          Enter your email address and we'll send you a code to reset your
          password
        </p>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <ViewSection>
            <TextField<ForgotPasswordFormData>
              control={control}
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              error={errors.email?.message}
            />
          </ViewSection>

          <SubmitButton type="submit" loading={isLoading}>
            Send Reset Code
          </SubmitButton>
        </form>

        <ErrorMessage>{error}</ErrorMessage>

        <LinksContainer>
          <LinkButton type="button" onClick={() => onNavigate("signIn")}>
            Back to Sign In
          </LinkButton>
          <LinkButton type="button" onClick={() => onNavigate("signUp")}>
            Create Account
          </LinkButton>
        </LinksContainer>
      </ViewContainer>
    </Container>
  );
}
