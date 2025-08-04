import { OpenAIIcon, GeminiIcon, GoogleIcon } from "../../assets/Icons";

interface ProviderCardProps {
  providerName: string;
  index: number;
  choiceClass?: string;
}

// AI Provider logos using imported icons
const ProviderLogos = {
  "GPT": <OpenAIIcon width={20} height={20} />,
  "Gemini": <GeminiIcon width={20} height={20} />,
  "Gemini Google Grounded": <GoogleIcon width={20} height={20} />,
};

export function ProviderCard({ providerName, index, choiceClass }: ProviderCardProps) {
  // Only use logos for known AI providers
  const logo = ProviderLogos[providerName as keyof typeof ProviderLogos];

  const getCardStyle = () => {
    const baseStyle = { ...styles.quizProviderCard };
    if (choiceClass === 'winning') {
      return {
        ...baseStyle,
        background: '#f59e0b',
        borderColor: '#d97706',
      };
    } else if (choiceClass === 'non-winning') {
      return {
        ...baseStyle,
        background: '#6b7280',
        borderColor: '#4b5563',
      };
    }
    return baseStyle;
  };

  return (
    <div style={getCardStyle()} title={`${providerName} - Vote #${index + 1}`}>
      {logo}
      <span style={styles.quizProviderName}>{providerName}</span>
    </div>
  );
}

const styles = {
  quizProviderCard: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    borderRadius: '0.375rem',
    padding: '0rem 0.25rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'white',
    minWidth: '50px',
    height: '2.25rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    flex: '1',
    justifyContent: 'center',
  },
  quizProviderName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
};
