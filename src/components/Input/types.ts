import React from 'react';

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

export type UploadState = { id: string; file: File; status: 'uploading' | 'done' | 'error'; error?: string };
