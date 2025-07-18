/**
 * components.tsx
 * Central authentication components with consistent theming
 */

import React from "react";
import {
  Controller,
  ControllerProps,
  FieldValues,
  Control,
} from "react-hook-form";
import { Logo } from "../assets/Logo";

const styles = {
  viewHeader: { marginBottom: 16 },
  viewDivider: { marginVertical: 16 },
  linksContainer: {
    display: "flex",
    flexDirection: "row" as const,
    justifyContent: "space-around",
    marginTop: 16,
  },
  errorMessage: { marginTop: 16, padding: 16 },
};

export interface TextFieldProps<T extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  control: Control<T>;
  name: keyof T;
  rules?: ControllerProps<T>["rules"];
  error?: string;
  label?: string;
  type?: "email" | "text" | "password" | "tel";
}

export function TextField<T extends FieldValues = FieldValues>({
  control,
  error,
  name,
  type = "text",
  rules,
  label,
  className,
  ...props
}: TextFieldProps<T>) {
  return (
    <div className="text-field-container">
      {label && (
        <label htmlFor={name as string} className="text-field-label">
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name as any}
        render={({ field }) => (
          <input
            {...props}
            {...field}
            id={name as string}
            type={type}
            className={`text-field-input ${error ? "error" : ""} ${
              className || ""
            }`}
          />
        )}
        rules={rules}
      />
      {error && <div className="text-field-error">{error}</div>}
    </div>
  );
}

export interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export function SubmitButton({
  children,
  disabled,
  loading,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`submit-button ${disabled || loading ? "disabled" : ""} ${
        className || ""
      }`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export interface ProviderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function ProviderButton({
  children,
  className,
  ...props
}: ProviderButtonProps) {
  return (
    <button {...props} className={`provider-button ${className || ""}`}>
      {children}
    </button>
  );
}

export interface ViewHeaderProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function ViewHeader({ children, className, ...props }: ViewHeaderProps) {
  return (
    <h1 {...props} className={`view-header ${className || ""}`}>
      {children}
    </h1>
  );
}

export interface ViewSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ViewSection({
  children,
  className,
  ...props
}: ViewSectionProps) {
  return (
    <div {...props} className={`view-section ${className || ""}`}>
      {children}
    </div>
  );
}

export interface LinksContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function LinksContainer({
  children,
  className,
  ...props
}: LinksContainerProps) {
  return (
    <div {...props} className={`links-container ${className || ""}`}>
      {children}
    </div>
  );
}

export interface LinkButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function LinkButton({ children, className, ...props }: LinkButtonProps) {
  return (
    <button {...props} className={`link-button ${className || ""}`}>
      {children}
    </button>
  );
}

export interface ErrorMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function ErrorMessage({
  children,
  className,
  ...props
}: ErrorMessageProps) {
  if (!children) return null;

  return (
    <div {...props} className={`error-message ${className || ""}`}>
      {children}
    </div>
  );
}

export interface ViewContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ViewContainer({
  children,
  className,
  ...props
}: ViewContainerProps) {
  return (
    <div {...props} className={`view-container ${className || ""}`}>
      {children}
    </div>
  );
}

export function ViewDivider({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`view-divider ${className || ""}`} />;
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div {...props} className={`auth-container ${className || ""}`}>
      {children}
    </div>
  );
}

export interface LogoHeaderProps {
  title?: string;
}

export function LogoHeader({ title = "CurateAI" }: LogoHeaderProps) {
  return (
    <div className="auth-logo-header">
      <Logo width={40} height={40} fill="white" />
      <h2 className="auth-logo-title">{title}</h2>
    </div>
  );
}

// OAuth Provider Icons
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export interface OAuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: "google" | "apple" | "facebook";
  children?: React.ReactNode;
  loading?: boolean;
}

export function OAuthButton({
  provider,
  children,
  loading,
  className,
  disabled,
  ...props
}: OAuthButtonProps) {
  const providerConfig = {
    google: {
      icon: <GoogleIcon />,
      defaultText: "Continue with Google",
      className: "oauth-button-google",
    },
    apple: {
      icon: <AppleIcon />,
      defaultText: "Continue with Apple",
      className: "oauth-button-apple",
    },
    facebook: {
      icon: <FacebookIcon />,
      defaultText: "Continue with Facebook",
      className: "oauth-button-facebook",
    },
  };

  const config = providerConfig[provider];

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`oauth-button ${config.className} ${className || ""}`}
    >
      {!loading && config.icon}
      <span className="oauth-button-text">
        {loading ? "Signing in..." : children || config.defaultText}
      </span>
    </button>
  );
}

export interface OAuthSectionProps {
  onOAuthSignIn: (provider: "google" | "apple" | "facebook") => void;
  loading?: string | null; // which provider is currently loading
}

export function OAuthSection({ onOAuthSignIn, loading }: OAuthSectionProps) {
  return (
    <div className="oauth-section">
      <OAuthButton
        provider="google"
        onClick={() => onOAuthSignIn("google")}
        loading={loading === "google"}
        disabled={!!loading}
      />
      <OAuthButton
        provider="apple"
        onClick={() => onOAuthSignIn("apple")}
        loading={loading === "apple"}
        disabled={!!loading}
      />
      <OAuthButton
        provider="facebook"
        onClick={() => onOAuthSignIn("facebook")}
        loading={loading === "facebook"}
        disabled={!!loading}
      />
    </div>
  );
}
