import { OpenAIIcon, GeminiIcon, GoogleIcon } from "../../assets/Icons";
import './Quiz.css';

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

  return (
    <div className={`quiz-provider-card ${choiceClass || ''}`} title={`${providerName} - Vote #${index + 1}`}>
      {logo}
      <span className="quiz-provider-name">{providerName}</span>
    </div>
  );
}
