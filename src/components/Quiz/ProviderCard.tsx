import { motion } from "framer-motion";
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
<<<<<<< HEAD
  "GPT": <OpenAIIcon width={18} height={18} />,
  "Gemini": <GeminiIcon width={18} height={18} />,
  "Gemini Google Grounded": <GoogleIcon width={18} height={18} />,
=======
  "GPT": <OpenAIIcon/>,
  "Gemini": <GeminiIcon/>,
  "Gemini Google Grounded": <GoogleIcon/>,
>>>>>>> origin/main
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
    const baseStyle = { ...styles.providerCard };
    if (choiceClass === 'winning') {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        border: '1px solid #d97706',
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
      };
    } else if (choiceClass === 'non-winning') {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        border: '1px solid #0891b2',
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)',
      };
    }
    return {
      ...baseStyle,
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      border: '1px solid #cbd5e1',
      color: '#475569',
    };
  };

  return (
<<<<<<< HEAD
    <motion.div 
      className="provider-card"
      style={getCardStyle()} 
      title={`${providerName} - Response #${index + 1}`}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="provider-logo" style={styles.providerLogo}>
        {logo}
      </div>
      <span className="provider-name" style={styles.providerName}>
        {providerName}
      </span>
    </motion.div>
=======
    <div ref={cardRef} style={getCardStyle()} title={`${providerName} - Vote #${index + 1}`}>
      {logo}
      {!showLogoOnly && <span style={styles.quizProviderName}>{providerName}</span>}
    </div>
>>>>>>> origin/main
  );
}

const styles = {
  providerCard: {
    display: 'inline-flex',
    alignItems: 'center',
<<<<<<< HEAD
    gap: '6px',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    minWidth: '80px',
    height: '36px',
    transition: 'all 0.2s ease',
    cursor: 'default',
=======
    gap: '0.25rem',
    borderRadius: '0.375rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'white',
    minWidth: '20px',
    height: '2.25rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    flex: '1 1 0%',
>>>>>>> origin/main
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
  },
  providerLogo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  providerName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    fontSize: '0.75rem',
    fontWeight: '500',
  },
};
