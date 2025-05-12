import type { ProviderInfo } from "./types"

export const providers: ProviderInfo[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Google's multimodal AI that can understand and generate text, images, and code.",
    logoSrc: "/google-g-logo.png",
    isAvailable: false, // Will be determined by the context
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Creator of ChatGPT and GPT-4, offering powerful language models for various tasks.",
    logoSrc: "/openai-logo-inspired-abstract.png",
    isAvailable: false, // Will be determined by the context
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Creator of Claude, focused on AI safety and helpful, harmless, and honest AI assistants.",
    logoSrc: "/anthropic-logo-abstract.png",
    isAvailable: false, // Will be implemented in the next iteration
  },
]
