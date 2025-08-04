import { motion } from "framer-motion";
import { OpenAIIcon, GeminiIcon, GoogleIcon } from "../../assets/Icons";

interface ProviderCardProps {
  providerName: string;
  index: number;
  choiceClass?: string;
}

// AI Provider logos using imported icons
const ProviderLogos = {
  "GPT": <OpenAIIcon width={18} height={18} />,
  "Gemini": <GeminiIcon width={18} height={18} />,
  "Gemini Google Grounded": <GoogleIcon width={18} height={18} />,
};

export function ProviderCard({ providerName, index, choiceClass }: ProviderCardProps) {
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
  );
}

const styles = {
  providerCard: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    minWidth: '80px',
    height: '36px',
    transition: 'all 0.2s ease',
    cursor: 'default',
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
