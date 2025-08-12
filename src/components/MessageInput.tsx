import React, { useState, useRef, useEffect } from 'react';

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  style?: React.CSSProperties;
  onEnterPress?: () => void; // optional: submit on Enter
}

/**
 * Reusable text message input with consistent styling & focus ring.
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Type your message...',
  isLoading = false,
  style = {},
  onEnterPress,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const baseStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    border: '1px solid #475569',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    lineHeight: '1.25rem',
    background: '#1e293b',
    color: '#e2e8f0',
    transition: 'border-color 0.2s, box-shadow 0.2s, height 0.1s ease',
    minHeight: '48px',
    resize: 'none',
    overflow: 'hidden',
    flex: 1,
    outline: 'none',
    ...(isFocused
      ? {
          borderColor: '#3b82f6',
          boxShadow: '0 0 0 3px rgba(59,130,246,0.1)',
        }
      : { boxShadow: 'none' }),
    ...(isLoading
      ? {
          background: '#1e293b',
          color: '#64748b',
          cursor: 'not-allowed',
        }
      : {}),
    ...style,
  };

  useEffect(() => {
    if (disabled && ref.current) {
      ref.current.blur();
    }
  }, [disabled]);

  // Auto-resize when value changes
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={(e) => {
        if (onEnterPress && e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onEnterPress();
        }
      }}
      rows={1}
      style={baseStyle}
    />
  );
};
