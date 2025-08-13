import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFileExtraction, useHiddenParsedText, usePasteImageHandler } from './logic';
import type { MessageInputProps } from './types';
import { SubmitButton } from './SubmitButton';
import { ModelSelect } from './ModelSelect';
import { FileUpload } from './FileUpload';

export * from './types';
export * from './logic';
export * from './SubmitButton';

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Type your message...',
  isLoading = false,
  onEnterPress,
  submitLabel = 'Send',
  maxHeight = 240,
  showModelSelect = false,
  model = 'chatgpt',
  onModelChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement | null>(null);

  // ========  FILE UPLOAD STATE ========
  const { uploads, parsedTexts, handleFiles, removeUpload, setParsedTexts, setUploads } = useFileExtraction();
  const { userText, setUserText, fullCombined, clearAll, clearingRef } = useHiddenParsedText(value, onChange, parsedTexts);
  const handlePaste = usePasteImageHandler(disabled, isLoading, handleFiles);

  // Auto-resize textarea & focus handling
  useEffect(() => { if (disabled && ref.current) ref.current.blur(); }, [disabled]);
  useEffect(() => {
    if (ref.current) {
      const el = ref.current;
      el.style.height = 'auto';
      const newHeight = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${newHeight}px`;
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [userText, maxHeight]);

  const handleSubmit = () => {
    console.log('Submitting:', fullCombined);
    if (disabled || isLoading) return;
    if (!fullCombined.trim()) return;
    if (onEnterPress) onEnterPress();
    clearingRef.current = true;
    setUploads([]);
    setParsedTexts([]);
    clearAll();
    onChange('');
    setTimeout(() => { clearingRef.current = false; }, 0);
  };

  // Ensure clicks inside container focus textarea (unless clicking remove buttons etc.)
  const focusTextarea = useCallback(() => {
    if (ref.current && !disabled) {
      ref.current.focus();
    }
  }, [disabled]);

  // Global typing capture: route keystrokes to textarea even when unfocused
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (disabled || isLoading) return; // respect disabled/loading
      if (e.isComposing) return; // ignore IME composing

      // Allow paste shortcut (Cmd/Ctrl+V) to pass through
      const isPasteShortcut = (e.metaKey || e.ctrlKey) && (e.key === 'v' || e.key === 'V');
      if (!isPasteShortcut && (e.metaKey || e.ctrlKey || e.altKey)) return; // ignore other shortcuts

      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (ref.current && document.activeElement === ref.current) return;
      if (ref.current) ref.current.focus();

      if (e.key === 'Enter') {
        if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          handleSubmit();
        } else if (e.shiftKey) {
          setUserText(prev => prev + '\n');
          e.preventDefault();
        }
        return;
      }
      if (e.key === 'Backspace') {
        setUserText(prev => prev.slice(0, -1));
        e.preventDefault();
        return;
      }
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        setUserText(prev => prev + e.key);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [disabled, isLoading, handleSubmit]);

  return (
    <div
      style={{
        ...styles.baseContainer,
        ...(isFocused ? styles.focus : styles.blur),
        ...(isLoading ? { opacity: 0.9 } : {}),
        cursor: disabled ? 'not-allowed' : 'text'
      }}
      onClick={focusTextarea}
    >
      <textarea
        ref={ref}
        value={userText}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setUserText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
        rows={1}
        style={{ ...styles.textArea, color: isLoading ? '#64748b' : '#e2e8f0', maxHeight }}
      />
      {/* Make footer elements also focus textarea when clicked */}
      <div style={styles.innerFooter} onClick={focusTextarea}>
        <div style={styles.uploadContainer}>
          <label style={styles.uploadBtn}>
            <input
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => { handleFiles(e.target.files); if (e.target) e.target.value=''; }}
              accept="image/*,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={disabled || isLoading}
            />
            Attach Files
          </label>
        </div>
        {uploads.length > 0 ? (
          <div style={styles.fileList}>
            {uploads.map(u => (
              <FileUpload key={u.id} upload={u} onRemove={removeUpload} />
            ))}
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        <div style={styles.rightGroup}>
          <div onClick={focusTextarea}>
            <ModelSelect
              value={model}
              disabled={disabled}
              isLoading={isLoading}
              show={showModelSelect}
              onChange={onModelChange}
            />
          </div>
          <div onClick={focusTextarea}>
            <SubmitButton
              label={submitLabel}
              disabled={disabled || isLoading || !fullCombined.trim()}
              isLoading={isLoading}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  baseContainer: { display: 'flex', flexDirection: 'column', flex: 1, border: '2px solid #475569', borderRadius: '0.75rem', padding: '0.5rem 0.75rem 0.5rem', transition: 'border-color 0.2s, box-shadow 0.2s' },
  focus: { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.1)' },
  blur: { borderColor: '#475569', boxShadow: 'none' },
  textArea: { padding: 0, margin: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem', lineHeight: '1.25rem', resize: 'none', overflowY: 'hidden', minHeight: '48px', fontFamily: 'inherit' },
  innerFooter: { display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' },
  rightGroup: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' },
  uploadContainer: { display: 'flex', flexDirection: 'column' },
  uploadBtn: { background: '#334155', color: '#e2e8f0', padding: '0.4rem 0.9rem', borderRadius: '0.375rem', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid #475569', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' },
  fileList: { display: 'flex', flex: 1, overflowX: 'auto', overflowY: 'hidden', gap: '0.5rem', padding: '0 0.25rem', scrollbarWidth: 'thin', alignItems: 'stretch' },
};