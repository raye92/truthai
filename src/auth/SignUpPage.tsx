import React from "react";
import { useForm } from "react-hook-form";
import { signUp } from "aws-amplify/auth";
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
  OAuthSection,
  ViewDivider,
} from "./components";
import "./auth.css";

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

export function SignUpPage({ onNavigate }: SignUpPageProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string>("");

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError("");

    try {
      await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
          },
        },
      });
      onNavigate("confirmEmail");
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LogoHeader />
      <ViewContainer>
        <ViewHeader>Create Account</ViewHeader>

        <OAuthSection
          loading={oauthLoading}
          setLoading={setOauthLoading}
          setError={setError}
        />

        <ViewDivider />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ViewSection>
            <TextField<SignUpFormData>
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

            <TextField<SignUpFormData>
              control={control}
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message:
                    "Password must contain uppercase, lowercase, number and special character",
                },
              }}
              error={errors.password?.message}
            />

            <TextField<SignUpFormData>
              control={control}
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              error={errors.confirmPassword?.message}
            />
          </ViewSection>

          <SubmitButton type="submit" loading={isLoading}>
            Create Account
          </SubmitButton>
        </form>

        <ErrorMessage>{error}</ErrorMessage>

        <LinksContainer>
          <span style={{ color: "#4a5568", fontSize: "14px" }}>
            Already have an account?{" "}
          </span>
          <LinkButton type="button" onClick={() => onNavigate("signIn")}>
            Sign In
          </LinkButton>
        </LinksContainer>
      </ViewContainer>
    </Container>
  );
}
