import { OpenAIIcon, GeminiIcon, GoogleIcon } from "../../assets/Icons";
import { useRef, useEffect, useState } from "react";

interface ProviderCardProps {
  providerName: string;
  index: number;
  choiceClass?: string;
  showLogoOnly?: boolean;
}

// AI Provider logos using imported icons
const ProviderLogos = {
  "GPT": <OpenAIIcon/>,
  "Gemini": <GeminiIcon/>,
  "Gemini Google Grounded": <GoogleIcon/>,
};

export function ProviderCard({ providerName, index, choiceClass, showLogoOnly: propShowLogoOnly }: ProviderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showLogoOnly, setShowLogoOnly] = useState(propShowLogoOnly || false);

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
    const baseStyle = { ...styles.quizProviderCard };
    if (choiceClass === 'winning') {
      return {
        ...baseStyle,
        background: '#f59e0b',
        borderColor: '#b45309',
      };
    } else if (choiceClass === 'non-winning') {
      return {
        ...baseStyle,
        background: '#334155',
        borderColor: '#1f2937',
      };
    }
    return baseStyle;
  };

  return (
    <div ref={cardRef} style={getCardStyle()} title={`${providerName} - Vote #${index + 1}`}>
      {logo}
      {!showLogoOnly && <span style={styles.quizProviderName}>{providerName}</span>}
    </div>
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
    color: '#f8fafc',
    minWidth: '20px',
    height: '2.25rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    flex: '1 1 0%',
    justifyContent: 'center',
  },
  quizProviderName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
};
