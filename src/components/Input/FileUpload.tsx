import React, { useState } from 'react';
import { getFileExt } from './logic';
import type { UploadState } from './types';

interface FileUploadProps {
  upload: UploadState;
  onRemove: (id: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ upload, onRemove }) => {
  const [hover, setHover] = useState(false);
  const ext = getFileExt(upload.file.name);
  const statusColor = upload.status === 'done' ? '#16a34a' : upload.status === 'error' ? '#dc2626' : '#f59e0b';

  return (
    <div
      style={{
        ...styles.card,
        borderColor: statusColor + '55',
        background: hover ? '#24324a' : '#1e293b'
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={styles.ext}>{ext}</span>
      <span style={styles.name} title={upload.file.name}>{upload.file.name}</span>
      <span style={{ ...styles.status, color: statusColor }}>
        <span style={{ ...styles.dot, background: statusColor }} />
        {upload.status === 'uploading' && 'Processing'}
        {upload.status === 'done' && 'Ready'}
        {upload.status === 'error' && 'Error'}
      </span>
      <button type="button" style={styles.removeBtn} onClick={() => onRemove(upload.id)} aria-label="Remove file">✕</button>
    </div>
  );
};

// ======== STYLES (local) ========
const styles: Record<string, React.CSSProperties> = {
  card: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    border: '1px solid #334155',
    borderRadius: '0.5rem',
    padding: '0.45rem 0.6rem',
    fontSize: '0.65rem',
    lineHeight: 1.2,
    maxWidth: '220px',
    transition: 'background 0.15s, border-color 0.15s'
  },
  ext: { background: '#334155', color: '#93c5fd', fontSize: '0.55rem', padding: '0.2rem 0.35rem', borderRadius: '0.375rem', fontWeight: 600, letterSpacing: '0.5px' },
  name: { fontWeight: 500, whiteSpace: 'nowrap', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', color: '#e2e8f0' },
  status: { fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.25rem' },
  dot: { width: 6, height: 6, borderRadius: '50%', display: 'inline-block' },
  removeBtn: { background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '0 0.25rem', alignSelf: 'flex-start' }
};
