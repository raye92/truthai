import React from 'react';

interface SubmitButtonProps {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  isInvalid?: boolean;
  loadingLabel?: string;
  loadingContent?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  type = 'button',
  disabled = false,
  isLoading = false,
  isInvalid = false,
  loadingLabel = 'Loading...',
  loadingContent,
  onClick,
  style = {},
}) => {
  const inactive = disabled || isInvalid;
  const base: React.CSSProperties = {
    padding: '0 1.5rem',
    background: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.375rem',
    fontWeight: 500,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap',
    ...(inactive ? { background: '#475569', cursor: 'not-allowed' } : {}),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={inactive}
      style={base}
      onClick={onClick}
      onMouseEnter={(e) => { if (!inactive && !isLoading) e.currentTarget.style.background = '#2563eb'; }}
      onMouseLeave={(e) => { if (!inactive && !isLoading) e.currentTarget.style.background = '#3b82f6'; }}
    >
      {isLoading ? (loadingContent || <span>{loadingLabel}</span>) : label}
    </button>
  );
};
