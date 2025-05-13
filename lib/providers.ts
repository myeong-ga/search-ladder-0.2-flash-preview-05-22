import type { ProviderInfo } from "./types"

export const providers: ProviderInfo[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Google's multimodal AI that can understand and generate text, images, and code.",
    logoSrc: "/google-g-logo.png",
    isAvailable: false, // Will be determined by the context
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", isDefault: true },
      { id: "gemini-2.5-flash-preview-04-17", name: "Gemini 2.5 Flash Preview" },
      { id: "gemini-2.5-pro-preview-05-06", name: "Gemini 2.5 Pro Preview" },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Creator of ChatGPT and GPT-4, offering powerful language models for various tasks.",
    logoSrc: "/openai-logo-inspired-abstract.png",
    isAvailable: false, // Will be determined by the context
    models: [
      { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", isDefault: true },
      { id: "o3-mini", name: "O3 Mini" },
      { id: "o4-mini", name: "O4 Mini" },
      { id: "gpt-4.1", name: "GPT-4.1" },
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      // Removed: chatgpt-4o-latest, gpt-4o-search-preview, gpt-4o-mini-search-preview, o1-mini
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Creator of Claude, focused on AI safety and helpful, harmless, and honest AI assistants.",
    logoSrc: "/anthropic-logo-abstract.png",
    isAvailable: false, // Will be implemented in the next iteration
    models: [
      { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet", isDefault: true },
      { id: "claude-3-7-sonnet-20250219", name: "Claude 3.7 Sonnet" },
      { id: "claude-3-5-haiku-latest", name: "Claude 3.5 Haiku" },
    ],
  },
]
