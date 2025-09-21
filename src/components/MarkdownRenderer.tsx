import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownRendererProps = {
  content: string;
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: (props: any) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.markdownLink}
          />
        ),
        code: ({ inline, className, children, ...props }: any) => (
          <code
            style={inline ? styles.inlineCode : styles.codeBlock}
            className={className}
            {...props}
          >
            {children}
          </code>
        ),
        pre: (props: any) => <pre style={styles.preBlock} {...props} />,
        p: (props: any) => <p style={styles.p} {...props} />,
        ul: (props: any) => <ul style={styles.ul} {...props} />,
        ol: (props: any) => <ol style={styles.ol} {...props} />,
        li: (props: any) => <li style={styles.li} {...props} />,
        blockquote: (props: any) => (
          <blockquote style={styles.blockquote} {...props} />
        ),
        table: (props: any) => <table style={styles.table} {...props} />,
        th: (props: any) => <th style={styles.th} {...props} />,
        td: (props: any) => <td style={styles.td} {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

const styles = {
  markdownLink: {
    color: '#60a5fa',
    textDecoration: 'underline',
  },
  p: { margin: '0' },
  inlineCode: {
    background: 'rgba(148,163,184,0.15)',
    padding: '0.15rem 0.35rem',
    borderRadius: '0.25rem',
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: '0.875rem',
  },
  preBlock: {
    background: '#0f172a',
    padding: '0.75rem 0.875rem',
    borderRadius: '0.5rem',
    overflowX: 'auto' as const,
    border: '1px solid #334155',
    margin: '0.75rem 0',
  },
  codeBlock: {
    display: 'block',
    background: 'transparent',
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: '0.85rem',
    lineHeight: 1.5,
    whiteSpace: 'pre',
  },
  ul: {
    paddingLeft: '1.25rem',
    margin: '0.5rem 0 0.75rem',
    listStyle: 'disc inside',
  },
  ol: {
    paddingLeft: '1.25rem',
    margin: '0.5rem 0 0.75rem',
    listStyle: 'decimal inside',
  },
  li: { margin: '0.25rem 0' },
  blockquote: {
    borderLeft: '4px solid #334155',
    margin: '0.75rem 0',
    padding: '0.25rem 0 0.25rem 0.75rem',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    margin: '0.75rem 0',
    fontSize: '0.875rem',
  },
  th: {
    border: '1px solid #334155',
    padding: '0.5rem 0.625rem',
    background: '#1e293b',
    textAlign: 'left' as const,
    fontWeight: 600,
  },
  td: {
    border: '1px solid #334155',
    padding: '0.5rem 0.625rem',
    verticalAlign: 'top' as const,
  },
};
