import React, { useRef, useState, useEffect } from 'react';
import { useFileExtraction, useHiddenParsedText, getFileExt } from './logic';
import type { MessageInputProps } from './types';

export * from './types';
export * from './logic';
export * from './MessageBubble';
export * from './SubmitButton';

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
  const { uploads, parsedTexts, handleFiles, removeUpload, setParsedTexts, setUploads } = useFileExtraction();
  const { userText, setUserText, fullCombined, combinedParsed, clearAll, clearingRef } = useHiddenParsedText(value, onChange, parsedTexts);

  // Sync external value changes back to userText logic already inside hook

  const containerStyle: React.CSSProperties = {
    ...styles.baseContainer,
    ...(isFocused ? styles.focus : styles.blur),
    ...(isLoading ? { opacity: 0.9 } : {}),
    ...style,
  };
  const textAreaStyle: React.CSSProperties = { ...styles.textArea, color: isLoading ? '#64748b' : '#e2e8f0', maxHeight };
  const selectStyle: React.CSSProperties = showModelSelect ? { ...styles.select, cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer' } : { display: 'none' };
  const submitBtnStyle: React.CSSProperties = { ...styles.submitBtn, background: (disabled || isLoading || !fullCombined.trim()) ? '#475569' : '#3b82f6', cursor: (disabled || isLoading || !fullCombined.trim()) ? 'not-allowed' : 'pointer' };

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

  return (
    <div style={containerStyle}>
      <textarea
        ref={ref}
        value={userText}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setUserText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
        rows={1}
        style={textAreaStyle}
      />
      {showSubmitButton && (
        <div style={styles.innerFooter}>
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
              {uploads.map(u => {
                const ext = getFileExt(u.file.name);
                const statusColor = u.status === 'done' ? '#16a34a' : u.status === 'error' ? '#dc2626' : '#f59e0b';
                return (
                  <div
                    key={u.id}
                    style={{ ...styles.fileItem, borderColor: statusColor + '55' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#24324a')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#1e293b')}
                  >
                    <span style={styles.fileExt}>{ext}</span>
                    <span style={{ fontWeight: 500, whiteSpace: 'nowrap', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.file.name}</span>
                    <span style={{ ...styles.fileStatus, color: statusColor, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ width: 6, height: 6, background: statusColor, borderRadius: '50%', display: 'inline-block' }} />
                      {u.status === 'uploading' && 'Processing'}
                      {u.status === 'done' && 'Ready'}
                      {u.status === 'error' && 'Error'}
                    </span>
                    <button type="button" onClick={() => removeUpload(u.id)} style={styles.removeBtn} aria-label="Remove file">✕</button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ flex: 1 }} />
          )}
          <div style={styles.rightGroup}>
            <select
              value={model}
              onChange={(e) => onModelChange && onModelChange(e.target.value as any)}
              style={selectStyle}
              disabled={disabled || isLoading}
              onFocus={(e) => { if (!disabled && !isLoading) (e.target as HTMLSelectElement).style.borderColor = '#3b82f6'; }}
              onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = '#475569'; }}
            >
              <option value="chatgpt">ChatGPT</option>
              <option value="gemini">Gemini</option>
              <option value="gemini_grounding" title="Gemini + Google Search">Gemini + Google Search</option>
            </select>
            <button
              type="button"
              disabled={disabled || isLoading || !fullCombined.trim()}
              onClick={handleSubmit}
              style={submitBtnStyle}
              onMouseEnter={(e) => { if (!(disabled || isLoading || !fullCombined.trim())) e.currentTarget.style.background = '#2563eb'; }}
              onMouseLeave={(e) => { if (!(disabled || isLoading || !fullCombined.trim())) e.currentTarget.style.background = '#3b82f6'; }}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


const styles = {
  baseContainer: { display: 'flex', flexDirection: 'column', flex: 1, border: '2px solid #475569', borderRadius: '0.75rem', padding: '0.5rem 0.75rem 0.5rem', transition: 'border-color 0.2s, box-shadow 0.2s' } as React.CSSProperties,
  focus: { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.1)' } as React.CSSProperties,
  blur: { borderColor: '#475569', boxShadow: 'none' } as React.CSSProperties,
  textArea: { padding: 0, margin: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem', lineHeight: '1.25rem', resize: 'none', overflowY: 'hidden', minHeight: '48px', fontFamily: 'inherit' } as React.CSSProperties,
  innerFooter: { display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' } as React.CSSProperties,
  rightGroup: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' } as React.CSSProperties,
  select: { padding: '0.5rem 0.75rem', border: '1px solid #475569', borderRadius: '0.375rem', fontSize: '0.9rem', background: '#1e293b', color: '#e2e8f0', width: '125px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', height: '40px' } as React.CSSProperties,
  submitBtn: { padding: '0.5rem 1.25rem', border: 'none', borderRadius: '0.375rem', color: '#ffffff', fontSize: '0.95rem', fontWeight: 500, transition: 'background-color 0.2s', height: '40px', display: 'flex', alignItems: 'center' } as React.CSSProperties,
  uploadContainer: { display: 'flex', flexDirection: 'column' } as React.CSSProperties,
  uploadBtn: { background: '#334155', color: '#e2e8f0', padding: '0.4rem 0.9rem', borderRadius: '0.375rem', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid #475569', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' } as React.CSSProperties,
  fileList: { display: 'flex', flex: 1, overflowX: 'auto', overflowY: 'hidden', gap: '0.5rem', padding: '0 0.25rem', scrollbarWidth: 'thin', alignItems: 'stretch' } as React.CSSProperties,
  fileItem: { flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.45rem 0.6rem', fontSize: '0.65rem', lineHeight: 1.2, maxWidth: '220px', transition: 'background 0.15s, border-color 0.15s' } as React.CSSProperties,
  fileStatus: { fontSize: '0.6rem', color: '#64748b' } as React.CSSProperties,
  fileExt: { background: '#334155', color: '#93c5fd', fontSize: '0.55rem', padding: '0.2rem 0.35rem', borderRadius: '0.375rem', fontWeight: 600, letterSpacing: '0.5px' } as React.CSSProperties,
  removeBtn: { background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '0 0.25rem', alignSelf: 'flex-start' } as React.CSSProperties,
};