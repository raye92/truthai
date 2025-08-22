import { OpenAIIcon, GeminiIcon, GoogleIcon } from "../../assets/Icons";
import { useRef, useEffect, useState } from "react";

interface ProviderCardProps {
  providerName: string;
  index: number;
  choiceClass?: string;
  showLogoOnly?: boolean;
  onClick?: () => void;
}

// AI Provider logos using imported icons
const ProviderLogos = {
  "GPT": <OpenAIIcon/>,
  "Gemini": <GeminiIcon/>,
  "Gemini Google Search": <GoogleIcon/>,
};

export function ProviderCard({ providerName, index, choiceClass, showLogoOnly: propShowLogoOnly, onClick }: ProviderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showLogoOnly, setShowLogoOnly] = useState(propShowLogoOnly || false);
  const [isHovered, setIsHovered] = useState(false);

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
        borderColor: '#d97706',
        ...(isHovered && { 
          background: '#d97706',
          transform: 'scale(1.05)',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
        }),
      };
    } else if (choiceClass === 'non-winning') {
      return {
        ...baseStyle,
        background: '#6b7280',
        borderColor: '#4b5563',
        ...(isHovered && { 
          background: '#4b5563',
          transform: 'scale(1.05)',
          boxShadow: '0 4px 12px rgba(107, 114, 128, 0.4)',
        }),
      };
    }
    return {
      ...baseStyle,
      ...(isHovered && { 
        transform: 'scale(1.05)',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
      }),
    };
  };

  return (
    <div 
      ref={cardRef} 
      title={`${providerName} - Vote #${index + 1}${onClick ? ' (Click to chat)' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...getCardStyle(),
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
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
    color: '#e2e8f0',
    minWidth: '20px',
    height: '2.25rem',
    transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
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
