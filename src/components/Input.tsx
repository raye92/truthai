import React, { useState, useRef, useEffect } from 'react';

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  style?: React.CSSProperties;
  onEnterPress?: () => void;
  showSubmitButton?: boolean;
  submitLabel?: string;
  maxHeight?: number;
  showModelSelect?: boolean;
  model?: 'chatgpt' | 'gemini' | 'gemini_grounding';
  onModelChange?: (model: 'chatgpt' | 'gemini' | 'gemini_grounding') => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Type your message...',
  isLoading = false,
  style = {},
  onEnterPress,
  showSubmitButton = true,
  submitLabel = 'Send',
  maxHeight = 240,
  showModelSelect = false,
  model = 'chatgpt',
  onModelChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    border: '2px solid #475569',
    borderRadius: '0.75rem',
    padding: '0.5rem 0.75rem 0.5rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    ...(isFocused
      ? { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.1)' }
      : { borderColor: '#475569', boxShadow: 'none' }
    ),
    ...(isLoading ? { opacity: 0.9 } : {}),
    ...style,
  };

  const textAreaStyle: React.CSSProperties = {
    padding: 0,
    margin: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: isLoading ? '#64748b' : '#e2e8f0',
    fontSize: '1rem',
    lineHeight: '1.25rem',
    resize: 'none',
    overflowY: 'hidden',
    minHeight: '48px',
    maxHeight: maxHeight,
    fontFamily: 'inherit',
  };

  const innerFooterStyle: React.CSSProperties = {
    display: showSubmitButton ? 'flex' : 'none',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  };

  const rightGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const selectStyle: React.CSSProperties = {
    display: showModelSelect ? 'block' : 'none',
    padding: '0.5rem 0.75rem',
    border: '1px solid #475569',
    borderRadius: '0.375rem',
    fontSize: '0.9rem',
    background: '#1e293b',
    color: '#e2e8f0',
    cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
    width: '125px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '40px',
  };

  const hintStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    color: '#64748b',
    fontStyle: 'italic',
  };

  const submitBtnStyle: React.CSSProperties = {
    padding: '0.5rem 1.25rem',
    border: 'none',
    borderRadius: '0.375rem',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: 500,
    transition: 'background-color 0.2s',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    background: (disabled || isLoading || !value.trim()) ? '#475569' : '#3b82f6',
    cursor: (disabled || isLoading || !value.trim()) ? 'not-allowed' : 'pointer',
  };

  useEffect(() => {
    if (disabled && ref.current) {
      ref.current.blur();
    }
  }, [disabled]);

  // Auto-resize when value changes
  useEffect(() => {
    if (ref.current) {
      const el = ref.current;
      el.style.height = 'auto';
      const newHeight = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${newHeight}px`;
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [value, maxHeight]);

  return (
    <div style={containerStyle}>
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
        style={textAreaStyle}
      />
      {showSubmitButton && (
        <div style={innerFooterStyle}>
          <span style={hintStyle}>Shift+Enter for newline</span>
          <div style={rightGroupStyle}>
            <select
              value={model}
              onChange={(e) => onModelChange && onModelChange(e.target.value as any)}
              style={selectStyle}
              disabled={disabled || isLoading}
              onFocus={(e) => {
                if (!disabled && !isLoading) {
                  (e.target as HTMLSelectElement).style.borderColor = '#3b82f6';
                }
              }}
              onBlur={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = '#475569';
              }}
            >
              <option value="chatgpt">ChatGPT</option>
              <option value="gemini">Gemini</option>
              <option value="gemini_grounding" title="Gemini + Google Search">Gemini + Google Search</option>
            </select>
            <button
              type="button"
              disabled={disabled || isLoading || !value.trim()}
              onClick={() => {
                if (onEnterPress && value.trim() && !disabled && !isLoading) onEnterPress();
              }}
              style={submitBtnStyle}
              onMouseEnter={(e) => {
                if (!(disabled || isLoading || !value.trim())) e.currentTarget.style.background = '#2563eb';
              }}
              onMouseLeave={(e) => {
                if (!(disabled || isLoading || !value.trim())) e.currentTarget.style.background = '#3b82f6';
              }}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
