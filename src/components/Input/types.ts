import React from 'react';

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  onEnterPress?: () => void;
  submitLabel?: string;
  maxHeight?: number;
  height?: number;
  width?: string;
  showModelSelect?: boolean;
  model?: 'chatgpt' | 'gemini' | 'gemini_grounding';
  onModelChange?: (model: 'chatgpt' | 'gemini' | 'gemini_grounding') => void;
}

export type UploadState = { id: string; file: File; status: 'uploading' | 'done' | 'error'; error?: string };
