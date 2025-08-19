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
}) => {
  const inactive = disabled || isInvalid;
  const style: React.CSSProperties = {
    ...styles.button,
    ...(inactive ? { background: '#475569', cursor: 'not-allowed' } : {}),
  };

  return (
    <button
      type={type}
      disabled={inactive}
      style={style}
      onClick={onClick}
      onMouseEnter={(e) => { if (!inactive && !isLoading) e.currentTarget.style.background = '#2563eb'; }}
      onMouseLeave={(e) => { if (!inactive && !isLoading) e.currentTarget.style.background = '#3b82f6'; }}
    >
      {isLoading ? (loadingContent || <span>{loadingLabel}</span>) : label}
    </button>
  );
};

// ======== STYLES ========
const styles: Record<string, React.CSSProperties> = {
  button: {
    padding: '0 1.5rem',
    background: '#3b82f6',
    color: '#e2e8f0',
    border: 'none',
    borderRadius: '0.375rem',
    fontWeight: 500,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap',
  },
};
