import React, { useRef } from 'react';

interface ModelSelectProps {
  value: 'chatgpt' | 'gemini' | 'gemini_grounding';
  disabled: boolean;
  isLoading: boolean;
  show: boolean;
  onChange?: (model: 'chatgpt' | 'gemini' | 'gemini_grounding') => void;
}

export const ModelSelect: React.FC<ModelSelectProps> = ({ value, disabled, isLoading, show, onChange }) => {
  const ref = useRef<HTMLSelectElement | null>(null);
  if (!show) return null;

  const style: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    border: '1px solid #475569',
    borderRadius: '0.375rem',
    fontSize: '0.9rem',
    background: '#1e293b',
    color: '#e2e8f0',
    width: '125px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '40px',
    cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
    transition: 'border-color 0.15s, box-shadow 0.15s'
  };

  return (
    <select
      ref={ref}
      value={value}
      disabled={disabled || isLoading}
      onChange={(e) => onChange && onChange(e.target.value as any)}
      style={style}
      onFocus={() => { if (!(disabled || isLoading) && ref.current) ref.current.style.borderColor = '#3b82f6'; }}
      onBlur={() => { if (ref.current) ref.current.style.borderColor = '#475569'; }}
    >
      <option value="chatgpt">ChatGPT</option>
      <option value="gemini">Gemini</option>
      <option value="gemini_grounding" title="Gemini + Google Search">Gemini + Google Search</option>
    </select>
  );
};
