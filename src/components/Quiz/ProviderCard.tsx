import { Provider } from "./types";
import './Quiz.css';

interface ProviderCardProps {
  provider: Provider;
  index: number;
}

// Sample SVG logos for different providers
const ProviderLogos = {
  "TechCorp": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="16" height="16" rx="3" fill="#3B82F6" />
      <rect x="6" y="6" width="8" height="8" rx="1" fill="white" />
      <circle cx="10" cy="10" r="2" fill="#3B82F6" />
    </svg>
  ),
  "DataFlow": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" fill="#10B981" />
      <path d="M6 10 L9 13 L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "CloudSync": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 14 C4 14 2 12 2 10 C2 8 4 6 6 6 C6 4 8 2 10 2 C12 2 14 4 14 6 C16 6 18 8 18 10 C18 12 16 14 14 14 Z" fill="#8B5CF6" />
      <circle cx="10" cy="10" r="2" fill="white" />
    </svg>
  ),
  "NetLink": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="7" width="6" height="6" rx="1" fill="#EF4444" />
      <rect x="12" y="7" width="6" height="6" rx="1" fill="#EF4444" />
      <line x1="8" y1="10" x2="12" y2="10" stroke="#EF4444" strokeWidth="2" />
    </svg>
  ),
  "WebForce": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <polygon points="10,2 18,16 2,16" fill="#F59E0B" />
      <polygon points="10,6 14,12 6,12" fill="white" />
    </svg>
  ),
  "DevOps Pro": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="6" cy="10" r="4" fill="#06B6D4" />
      <circle cx="14" cy="10" r="4" fill="#06B6D4" />
      <rect x="8" y="9" width="4" height="2" fill="#06B6D4" />
    </svg>
  ),
  "AI Systems": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="2" fill="#EC4899" />
      <circle cx="7" cy="7" r="1.5" fill="white" />
      <circle cx="13" cy="7" r="1.5" fill="white" />
      <path d="M7 13 Q10 15 13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "BlockChain": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" fill="#8B5CF6" />
      <rect x="8" y="2" width="5" height="5" rx="1" fill="#8B5CF6" />
      <rect x="14" y="2" width="4" height="5" rx="1" fill="#8B5CF6" />
      <rect x="2" y="8" width="5" height="5" rx="1" fill="#8B5CF6" />
      <rect x="8" y="8" width="5" height="5" rx="1" fill="#8B5CF6" />
      <rect x="14" y="8" width="4" height="5" rx="1" fill="#8B5CF6" />
    </svg>
  ),
  "SecureNet": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2 L16 6 L16 14 L10 18 L4 14 L4 6 Z" fill="#059669" />
      <path d="M8 10 L9 11 L12 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "InnovateLab": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="5" fill="#DC2626" />
      <rect x="8" y="11" width="4" height="7" rx="1" fill="#DC2626" />
      <rect x="6" y="15" width="8" height="2" rx="1" fill="#DC2626" />
    </svg>
  ),
};

const providerNames = Object.keys(ProviderLogos);

export function ProviderCard({ provider, index }: ProviderCardProps) {
  // Use provider name if it exists in our logos, otherwise use a random one based on index
  const logoKey = providerNames.includes(provider.name) 
    ? provider.name 
    : providerNames[index % providerNames.length];
  
  const logo = ProviderLogos[logoKey as keyof typeof ProviderLogos];

  return (
    <div className="quiz-provider-card" title={`${provider.name} - Vote #${index + 1}`}>
      {logo}
      <span className="quiz-provider-name">{provider.name}</span>
    </div>
  );
}

// Helper function to generate sample providers
export function generateSampleProviders(count: number): Provider[] {
  const sampleProviders = [
    { name: "TechCorp", url: "https://techcorp.com" },
    { name: "DataFlow", url: "https://dataflow.io" },
    { name: "CloudSync", url: "https://cloudsync.net" },
    { name: "NetLink", url: "https://netlink.com" },
    { name: "WebForce", url: "https://webforce.dev" },
    { name: "DevOps Pro", url: "https://devopspro.io" },
    { name: "AI Systems", url: "https://aisystems.ai" },
    { name: "BlockChain", url: "https://blockchain.tech" },
    { name: "SecureNet", url: "https://securenet.io" },
    { name: "InnovateLab", url: "https://innovatelab.com" },
  ];

  const providers: Provider[] = [];
  for (let i = 0; i < count; i++) {
    providers.push(sampleProviders[i % sampleProviders.length]);
  }
  return providers;
}
