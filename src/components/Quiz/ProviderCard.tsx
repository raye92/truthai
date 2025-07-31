import { Provider } from "./types";
import { OpenAIIcon, GeminiIcon, GoogleIcon } from "../../assets/Icons";
import './Quiz.css';

interface ProviderCardProps {
  provider: Provider;
  index: number;
  choiceClass?: string;
}

// AI Provider logos using imported icons
const ProviderLogos = {
  "GPT": <OpenAIIcon width={20} height={20} />,
  "Gemini": <GeminiIcon width={20} height={20} />,
  "Gemini Google Grounded": <GoogleIcon width={20} height={20} />,
};

export function ProviderCard({ provider, index, choiceClass }: ProviderCardProps) {
  // Only use logos for known AI providers
  const logo = ProviderLogos[provider.name as keyof typeof ProviderLogos];

  return (
    <div className={`quiz-provider-card ${choiceClass || ''}`} title={`${provider.name} - Vote #${index + 1}`}>
      {logo}
      <span className="quiz-provider-name">{provider.name}</span>
    </div>
  );
}

// Helper function to get AI providers only
export function getAIProviders(): Provider[] {
  return [
    { name: "GPT", url: "https://openai.com" },
    { name: "Gemini", url: "https://gemini.google.com" },
    { name: "Gemini Google Grounded", url: "https://gemini.google.com" },
  ];
}
