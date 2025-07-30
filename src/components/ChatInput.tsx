import { FormEvent, useState } from "react";
import "./ChatInput.css";
import type { ChatOptions } from "../hooks/useChat";

interface ChatInputProps {
  onSendMessage: (message: string, options: ChatOptions) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<"chatgpt" | "gemini">("chatgpt");
  const [useGrounding, setUseGrounding] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const options: ChatOptions = {
      model: selectedModel,
      useGrounding: selectedModel === "gemini" ? useGrounding : undefined
    };

    onSendMessage(input, options);
    setInput("");
  };

  return (
    <div className="chat-input-container">
      {selectedModel === "gemini" && (
        <div className="grounding-option-top">
          <label className="grounding-label">
            <input
              type="checkbox"
              checked={useGrounding}
              onChange={(e) => setUseGrounding(e.target.checked)}
              disabled={isLoading}
            />
            Google Search Grounding
          </label>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
          disabled={isLoading}
        />
        
        <div className="model-selector">
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value as "chatgpt" | "gemini")}
            disabled={isLoading}
            className="model-select"
          >
            <option value="chatgpt">ChatGPT</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          Send
        </button>
      </form>
    </div>
  );
}
