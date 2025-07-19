import React from "react";
import { useForm } from "react-hook-form";
import { signIn } from "aws-amplify/auth";
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

interface SignInFormData {
  email: string;
  password: string;
}

interface SignInPageProps {
  onNavigate: (page: string) => void;
}

export function SignInPage({ onNavigate }: SignInPageProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setError("");

    try {
      await signIn({
        username: data.email,
        password: data.password,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LogoHeader />
      <ViewContainer>
        <ViewHeader>Sign In</ViewHeader>

        <OAuthSection
          loading={oauthLoading}
          setLoading={setOauthLoading}
          setError={setError}
        />

        <ViewDivider />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ViewSection>
            <TextField
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

            <TextField
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
              }}
              error={errors.password?.message}
            />
          </ViewSection>

          <SubmitButton type="submit" loading={isLoading}>
            Sign In
          </SubmitButton>
        </form>

        <ErrorMessage>{error}</ErrorMessage>

        <LinksContainer>
          <LinkButton
            type="button"
            onClick={() => onNavigate("forgotPassword")}
          >
            Forgot Password?
          </LinkButton>
          <LinkButton type="button" onClick={() => onNavigate("signUp")}>
            Create Account
          </LinkButton>
        </LinksContainer>
      </ViewContainer>
    </Container>
  );
}
