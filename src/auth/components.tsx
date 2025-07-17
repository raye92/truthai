/**
 * components.tsx
 * Central authentication components with consistent theming
 */

import React from 'react';
import { Controller, ControllerProps, FieldValues, Control } from 'react-hook-form';

const styles = {
  viewHeader: { marginBottom: 16 },
  viewDivider: { marginVertical: 16 },
  linksContainer: {
    display: 'flex',
    flexDirection: 'row' as const,
    justifyContent: 'space-around',
    marginTop: 16,
  },
  errorMessage: { marginTop: 16, padding: 16 },
};

export interface TextFieldProps<T extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  control: Control<T>;
  name: keyof T;
  rules?: ControllerProps<T>['rules'];
  error?: string;
  label?: string;
  type?: 'email' | 'text' | 'password' | 'tel';
}

export function TextField<T extends FieldValues = FieldValues>({
  control,
  error,
  name,
  type = 'text',
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
            className={`text-field-input ${error ? 'error' : ''} ${className || ''}`}
          />
        )}
        rules={rules}
      />
      {error && (
        <div className="text-field-error">
          {error}
        </div>
      )}
    </div>
  );
}

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
      className={`submit-button ${disabled || loading ? 'disabled' : ''} ${className || ''}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

export interface ProviderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function ProviderButton({ children, className, ...props }: ProviderButtonProps) {
  return (
    <button {...props} className={`provider-button ${className || ''}`}>
      {children}
    </button>
  );
}

export interface ViewHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function ViewHeader({ children, className, ...props }: ViewHeaderProps) {
  return (
    <h1 {...props} className={`view-header ${className || ''}`}>
      {children}
    </h1>
  );
}

export interface ViewSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ViewSection({ children, className, ...props }: ViewSectionProps) {
  return (
    <div {...props} className={`view-section ${className || ''}`}>
      {children}
    </div>
  );
}

export interface LinksContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function LinksContainer({ children, className, ...props }: LinksContainerProps) {
  return (
    <div {...props} className={`links-container ${className || ''}`}>
      {children}
    </div>
  );
}

export interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function LinkButton({ children, className, ...props }: LinkButtonProps) {
  return (
    <button {...props} className={`link-button ${className || ''}`}>
      {children}
    </button>
  );
}

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function ErrorMessage({ children, className, ...props }: ErrorMessageProps) {
  if (!children) return null;

  return (
    <div {...props} className={`error-message ${className || ''}`}>
      {children}
    </div>
  );
}

export interface ViewContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ViewContainer({ children, className, ...props }: ViewContainerProps) {
  return (
    <div {...props} className={`view-container ${className || ''}`}>
      {children}
    </div>
  );
}

export function ViewDivider({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`view-divider ${className || ''}`} />;
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div {...props} className={`auth-container ${className || ''}`}>
      {children}
    </div>
  );
}
