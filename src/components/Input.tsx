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

// Style constant declarations
let baseContainerStyle: React.CSSProperties;
let focusContainerStyle: React.CSSProperties;
let blurContainerStyle: React.CSSProperties;
let baseTextAreaStyle: React.CSSProperties;
let baseInnerFooterStyle: React.CSSProperties;
let rightGroupStyleConst: React.CSSProperties;
let baseSelectStyle: React.CSSProperties;
let baseSubmitBtnStyle: React.CSSProperties;
let uploadContainerStyle: React.CSSProperties;
let uploadButtonStyle: React.CSSProperties;
let filePreviewListStyle: React.CSSProperties;
let filePreviewItemStyle: React.CSSProperties;
let fileStatusStyle: React.CSSProperties;
let removeFileBtnStyle: React.CSSProperties;

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
  // ========  FILE UPLOAD STATE ========
  type UploadState = { id: string; file: File; status: 'uploading' | 'done' | 'error'; error?: string };
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [parsedTexts, setParsedTexts] = useState<{ id: string; text: string }[]>([]);
  const [userText, setUserText] = useState<string>('');
  // ====================================

  // Parsed text concatenation (hidden from user)
  const combinedParsed = parsedTexts.map(p => p.text).join('\n\n');
  // Text shown to user excludes parsed texts now
  const displayedValue = userText;
  // Full payload (parsed first, then user input if present)
  const fullCombined = combinedParsed && userText
    ? combinedParsed + '\n\n' + userText
    : combinedParsed || userText;

  // Sync parent with fullCombined while keeping parsed texts hidden in UI
  useEffect(() => {
    if (value !== fullCombined) {
      onChange(fullCombined);
    }
    console.log('ALL TEXT:', fullCombined); // Verification log
  }, [fullCombined, value, onChange]);

  // If parent value changes externally, attempt to re-derive userText
  useEffect(() => {
    if (value === fullCombined) return; // already synced
    if (combinedParsed && value.startsWith(combinedParsed)) {
      let rest = value.slice(combinedParsed.length);
      if (rest.startsWith('\n\n')) rest = rest.slice(2);
      setUserText(rest);
    } else if (!combinedParsed) {
      setUserText(value); // everything is user text when no parsed texts
    } else {
      // Cannot safely split; treat entire value as user text and drop parsed texts
      setParsedTexts([]);
      setUserText(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const containerStyle: React.CSSProperties = {
    ...baseContainerStyle,
    ...(isFocused ? focusContainerStyle : blurContainerStyle),
    ...(isLoading ? { opacity: 0.9 } : {}),
    ...style,
  };

  const textAreaStyle: React.CSSProperties = {
    ...baseTextAreaStyle,
    color: isLoading ? '#64748b' : '#e2e8f0',
    maxHeight,
  };

  const innerFooterStyle: React.CSSProperties = showSubmitButton ? baseInnerFooterStyle : { display: 'none' };

  const rightGroupStyle = rightGroupStyleConst;

  const selectStyle: React.CSSProperties = showModelSelect
    ? { ...baseSelectStyle, cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer' }
    : { display: 'none' };

  const submitBtnStyle: React.CSSProperties = {
    ...baseSubmitBtnStyle,
    background: (disabled || isLoading || !value.trim()) ? '#475569' : '#3b82f6',
    cursor: (disabled || isLoading || !value.trim()) ? 'not-allowed' : 'pointer',
  };

  useEffect(() => { if (disabled && ref.current) ref.current.blur(); }, [disabled]);

  useEffect(() => {
    if (ref.current) {
      const el = ref.current;
      el.style.height = 'auto';
      const newHeight = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${newHeight}px`;
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [displayedValue, maxHeight]);

  // ======== FILE UPLOAD FUNCTIONS ========
  const extractTextFromImage = async (file: File): Promise<string> => {
    try {
      // Use high-level recognize API to avoid worker typing issues
      // @ts-ignore - optional dependency & loose types
      const Tesseract: any = await import('tesseract.js');
      const result = await Tesseract.recognize(file, 'eng');
      const text: string = result?.data?.text ? String(result.data.text).trim() : '';
      return text;
    } catch (e) {
      console.warn('Image OCR failed.', e);
      return `[Image: ${file.name}]`;
    }
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      // @ts-ignore optional dependency
      const pdfjs = await import('pdfjs-dist');
      // @ts-ignore worker src
      if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
        // @ts-ignore
        pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker?url')).default;
      }
      const buff = await file.arrayBuffer();
      // @ts-ignore
      const pdf = await pdfjs.getDocument({ data: buff }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((it: any) => it.str).join(' ');
        text += strings + '\n';
      }
      return text.trim();
    } catch (e) {
      console.warn('PDF extraction failed.', e);
      return `[PDF: ${file.name}]`;
    }
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    try {
      // @ts-ignore optional dependency
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      // @ts-ignore
      const { value: text } = await mammoth.extractRawText({ arrayBuffer });
      return text.trim();
    } catch (e) {
      console.warn('DOCX extraction failed.', e);
      return `[Document: ${file.name}]`;
    }
  };

  const extractText = async (file: File): Promise<string> => {
    if (file.type.startsWith('image/')) return extractTextFromImage(file);
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return extractTextFromPdf(file);
    if (file.name.toLowerCase().endsWith('.docx')) return extractTextFromDocx(file);
    return `[Unsupported file: ${file.name}]`;
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    const accepted = Array.from(fileList).filter(f => (
      f.type.startsWith('image/') ||
      f.type === 'application/pdf' ||
      f.name.toLowerCase().endsWith('.pdf') ||
      f.name.toLowerCase().endsWith('.docx')
    ));

    const newUploads: UploadState[] = accepted.map(f => ({ id: `${Date.now()}-${f.name}-${Math.random()}`, file: f, status: 'uploading' }));
    setUploads(prev => [...prev, ...newUploads]);

    for (const up of newUploads) {
      try {
        const text = await extractText(up.file);
        setUploads(prev => prev.map(p => p.id === up.id ? { ...p, status: 'done' } : p));
        setParsedTexts(prev => {
          const next = [...prev, { id: up.id, text }];
          console.log('Parsed texts array:', next.map(t => t.text));
          return next;
        });
      } catch (e: any) {
        setUploads(prev => prev.map(p => p.id === up.id ? { ...p, status: 'error', error: e?.message || 'Error' } : p));
      }
    }
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
    setParsedTexts(prev => {
      const next = prev.filter(t => t.id !== id);
      console.log('Parsed texts array:', next.map(t => t.text));
      return next;
    });
  };
  // ======== FILE UPLOAD FUNCTIONS ========

  return (
    <div style={containerStyle}>
      <textarea
        ref={ref}
        value={displayedValue}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          setUserText(e.target.value); // Directly update user text only
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => { if (onEnterPress && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onEnterPress(); } }}
        rows={1}
        style={textAreaStyle}
      />
      {uploads.length > 0 && ( // ======== FILE UPLOAD RENDERING ========
        <div style={filePreviewListStyle}>
          {uploads.map(u => (
            <div key={u.id} style={filePreviewItemStyle}>
              <span style={{ fontWeight: 500 }}>{u.file.name}</span>
              <span style={fileStatusStyle}>
                {u.status === 'uploading' && 'Extracting...'}
                {u.status === 'done' && '✓'}
                {u.status === 'error' && 'Error'}
              </span>
              <button type="button" onClick={() => removeUpload(u.id)} style={removeFileBtnStyle} aria-label="Remove file">✕</button>
            </div>
          ))}
        </div>
      )}
      {showSubmitButton && (
        <div style={innerFooterStyle}>
          <div style={uploadContainerStyle}>
            <label style={uploadButtonStyle}>
              <input
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
                accept="image/*,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                disabled={disabled || isLoading}
              />
              Attach Files
            </label>
          </div>   {/* // ======== FILE UPLOAD RENDERING ======== */}
          <div style={rightGroupStyle}>
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
              disabled={disabled || isLoading || !value.trim()}
              onClick={() => { if (onEnterPress && value.trim() && !disabled && !isLoading) onEnterPress(); }}
              style={submitBtnStyle}
              onMouseEnter={(e) => { if (!(disabled || isLoading || !value.trim())) e.currentTarget.style.background = '#2563eb'; }}
              onMouseLeave={(e) => { if (!(disabled || isLoading || !value.trim())) e.currentTarget.style.background = '#3b82f6'; }}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===================
// Style definitions
// ===================
baseContainerStyle = { display: 'flex', flexDirection: 'column', flex: 1, border: '2px solid #475569', borderRadius: '0.75rem', padding: '0.5rem 0.75rem 0.5rem', transition: 'border-color 0.2s, box-shadow 0.2s' };
focusContainerStyle = { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.1)' };
blurContainerStyle = { borderColor: '#475569', boxShadow: 'none' };
baseTextAreaStyle = { padding: 0, margin: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem', lineHeight: '1.25rem', resize: 'none', overflowY: 'hidden', minHeight: '48px', fontFamily: 'inherit' };
baseInnerFooterStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' };
rightGroupStyleConst = { display: 'flex', alignItems: 'center', gap: '0.5rem' };
baseSelectStyle = { padding: '0.5rem 0.75rem', border: '1px solid #475569', borderRadius: '0.375rem', fontSize: '0.9rem', background: '#1e293b', color: '#e2e8f0', width: '125px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', height: '40px' };
baseSubmitBtnStyle = { padding: '0.5rem 1.25rem', border: 'none', borderRadius: '0.375rem', color: '#ffffff', fontSize: '0.95rem', fontWeight: 500, transition: 'background-color 0.2s', height: '40px', display: 'flex', alignItems: 'center' };
uploadContainerStyle = { display: 'flex', flexDirection: 'column', gap: '0.25rem' };
uploadButtonStyle = { background: '#334155', color: '#e2e8f0', padding: '0.4rem 0.9rem', borderRadius: '0.375rem', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid #475569', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' };
filePreviewListStyle = { display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.35rem', maxHeight: '140px', overflowY: 'auto', paddingRight: '0.25rem' };
filePreviewItemStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.375rem', padding: '0.35rem 0.5rem', fontSize: '0.7rem', lineHeight: 1.2 };
fileStatusStyle = { fontSize: '0.65rem', color: '#64748b' };
removeFileBtnStyle = { background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '0 0.25rem' };
