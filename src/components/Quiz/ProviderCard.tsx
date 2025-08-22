import { OpenAIIcon, GeminiIcon, GoogleIcon } from "../../assets/Icons";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MiniChat } from "../MiniChat.tsx";

interface ProviderCardProps {
  providerName: string;
  index: number;
  choiceClass?: string;
  showLogoOnly?: boolean;
  // New props to build the initial chat prompt
  questionText?: string;
  answerText?: string;
}

// AI Provider logos using imported icons
const ProviderLogos = {
  "GPT": <OpenAIIcon/>,
  "Gemini": <GeminiIcon/>,
  "Gemini Google Search": <GoogleIcon/>,
};

// Map quiz provider labels to chat model identifiers
const mapProviderToModel = (providerName: string): 'chatgpt' | 'gemini' | 'gemini_grounding' => {
  if (providerName === 'GPT') return 'chatgpt';
  if (providerName === 'Gemini Google Search') return 'gemini_grounding';
  return 'gemini';
};

export function ProviderCard({ providerName, index, choiceClass, showLogoOnly: propShowLogoOnly, questionText, answerText }: ProviderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showLogoOnly, setShowLogoOnly] = useState(propShowLogoOnly || false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkWidth = () => {
      if (cardRef.current) {
        const width = cardRef.current.offsetWidth;
        setShowLogoOnly(width < 50);
      }
    };

    // Check width on mount and when window resizes
    checkWidth();
    window.addEventListener('resize', checkWidth);
    
    // Use ResizeObserver for more accurate width detection
    const resizeObserver = new ResizeObserver(checkWidth);
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkWidth);
      resizeObserver.disconnect();
    };
  }, [propShowLogoOnly]);

  // Only use logos for known AI providers
  const logo = ProviderLogos[providerName as keyof typeof ProviderLogos];

  const getCardStyle = () => {
    const baseStyle = { ...styles.quizProviderCard } as React.CSSProperties;
    if (choiceClass === 'winning') {
      return {
        ...baseStyle,
        background: '#f59e0b',
        borderColor: '#d97706',
      } as React.CSSProperties;
    } else if (choiceClass === 'non-winning') {
      return {
        ...baseStyle,
        background: '#6b7280',
        borderColor: '#4b5563',
      } as React.CSSProperties;
    }
    return baseStyle;
  };

  const initialModel = mapProviderToModel(providerName);
  const initialPrompt = (() => {
    const q = (questionText || '').trim();
    const a = (answerText || '').trim();
    if (q && a) return `Explain, step by step, why the following answer is correct (or not) for the question.\n\nQuestion: ${q}\nAnswer: ${a}`;
    if (q) return `Explain your answer to the question: ${q}`;
    return 'Explain your answer in detail.';
  })();

  const handleFullScreen = () => {
    navigate('/chat', { state: { initialModel, initialPrompt } });
    setOpen(false);
  };

  return (
    <>
      <div
        ref={cardRef}
        style={{ ...getCardStyle(), cursor: 'pointer' }}
        title={`${providerName} - Vote #${index + 1}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {logo}
        {!showLogoOnly && <span style={styles.quizProviderName}>{providerName}</span>}
      </div>

      {open && (
        <MiniChat
          providerLabel={providerName}
          initialModel={initialModel}
          initialPrompt={initialPrompt}
          onClose={() => setOpen(false)}
          onFullScreen={handleFullScreen}
        />
      )}
    </>
  );
}

const styles = {
  quizProviderCard: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    borderRadius: '0.375rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#e2e8f0',
    minWidth: '20px',
    height: '2.25rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    flex: '1 1 0%',
    justifyContent: 'center',
  },
  quizProviderName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
};
