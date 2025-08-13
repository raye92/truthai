import { useEffect, useRef, useState } from 'react';
import type { MessageInputProps, UploadState } from './types';

// Extraction helpers (OCR / parsing)
export const useFileExtraction = () => {
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [parsedTexts, setParsedTexts] = useState<{ id: string; text: string }[]>([]);

  const extractTextFromImage = async (file: File): Promise<string> => {
    try {
      // @ts-ignore dynamic optional dependency
      const Tesseract: any = await import('tesseract.js');
      const result = await Tesseract.recognize(file, 'eng');
      return (result?.data?.text || '').trim();
    } catch {
      return `[Image: ${file.name}]`;
    }
  };
  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      // @ts-ignore optional dep
      const pdfjs = await import('pdfjs-dist');
      // @ts-ignore
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
        text += content.items.map((it: any) => it.str).join(' ') + '\n';
      }
      return text.trim();
    } catch {
      return `[PDF: ${file.name}]`;
    }
  };
  const extractTextFromDocx = async (file: File): Promise<string> => {
    try {
      // @ts-ignore optional dep
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      // @ts-ignore
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      return (value || '').trim();
    } catch {
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
        setParsedTexts(prev => [...prev, { id: up.id, text }]);
      } catch (e: any) {
        setUploads(prev => prev.map(p => p.id === up.id ? { ...p, status: 'error', error: e?.message || 'Error' } : p));
      }
    }
  };
  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
    setParsedTexts(prev => prev.filter(t => t.id !== id));
  };

  return { uploads, parsedTexts, handleFiles, removeUpload, setParsedTexts, setUploads };
};

// Hook for syncing combined value while hiding parsed texts from UI
export const useHiddenParsedText = (value: string, onChange: (v: string) => void, parsedTexts: { id: string; text: string }[]) => {
  const [userText, setUserText] = useState('');
  const clearingRef = useRef(false);
  const combinedParsed = parsedTexts.map(p => p.text).join('\n\n');
  const fullCombined = combinedParsed && userText ? `${combinedParsed}\n\n${userText}` : combinedParsed || userText;
  const externalPrevRef = useRef<string | null>(null);

  // Push local changes upward (only when our computed string changes)
  useEffect(() => {
    if (clearingRef.current) return; // skip while clearing
    if (value !== fullCombined) {
      onChange(fullCombined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullCombined]);

  // Handle external value changes (e.g., parent resets). Only run when parent value actually differs from what we last derived.
  useEffect(() => {
    if (clearingRef.current) return;
    if (externalPrevRef.current === value) return; // no real external change
    externalPrevRef.current = value;

    if (value === fullCombined) return; // already in sync

    if (combinedParsed && value.startsWith(combinedParsed)) {
      let rest = value.slice(combinedParsed.length);
      if (rest.startsWith('\n\n')) rest = rest.slice(2);
      setUserText(rest);
    } else if (!combinedParsed) {
      setUserText(value);
    } else {
      // fallback: treat everything as user text (drop parsed segments)
      setUserText(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, combinedParsed]);

  const clearAll = () => {
    clearingRef.current = true;
    setUserText('');
    externalPrevRef.current = '';
    setTimeout(() => { clearingRef.current = false; }, 0);
  };

  return { userText, setUserText, fullCombined, combinedParsed, clearAll, clearingRef };
};

export const getFileExt = (name: string) => {
  const parts = name.split('.');
  if (parts.length > 1) return parts.pop()!.toUpperCase();
  return 'FILE';
};
