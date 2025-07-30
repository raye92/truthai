import { Provider } from "./types";
import './Quiz.css';

interface ProviderCardProps {
  provider: Provider;
  index: number;
  choiceClass?: string;
}

// AI Provider SVG logos
const ProviderLogos = {
  "GPT": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" fill="#00A67E" />
      <path d="M6 10 L9 7 L14 12 L9 13 Z" fill="white" />
    </svg>
  ),
  "Gemini": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" fill="#4285F4" />
      <polygon points="10,4 16,10 10,16 4,10" fill="white" />
    </svg>
  ),
  "Gemini Google Grounded": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" fill="#EA4335" />
      <polygon points="10,4 16,10 10,16 4,10" fill="white" />
      <circle cx="13" cy="7" r="2" fill="#34A853" />
    </svg>
  ),
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
