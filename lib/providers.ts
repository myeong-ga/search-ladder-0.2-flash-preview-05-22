import type { ProviderInfo } from "./types"

// 원론적 입장에서 생각하면 모델의 web search tool 의 사용은 thinking ( test time scaling ) 능력과 연관이 깊다.
// Thinking 모델 대상으로 profile / benchmark 진행되어야 한다.
// Gemini : 검색기반 Agent , OpenAI : Knowledge기반 Agent 로 posiiton

export const providers: ProviderInfo[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Google's multimodal AI that can understand and generate text, images, and code.",
    logoSrc: "/google-g-logo.png",
    isAvailable: false, // Will be determined by the context
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", reasoningType: "Thinking" },
      { id: "gemini-2.5-flash-preview-05-20", name: "gemini-2.5-flash-preview-05-20", reasoningType: "Thinking" , isDefault: true,},
      {
        id: "gemini-2.5-pro-preview-05-06",
        name: "gemini-2.5-pro-preview-05-06",
        reasoningType: "Thinking",
      },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Creator of ChatGPT and GPT-4, offering powerful language models for various tasks.",
    logoSrc: "/openai-logo-inspired-abstract.png",
    isAvailable: false, // Will be determined by the context
    models: [
      { id: "gpt-4.1-mini", name: "GPT-4.1 Mini", reasoningType: "Intelligence" },
      { id: "gpt-4.1", name: "GPT-4.1", reasoningType: "Intelligence", isDefault: true, },
      { id: "o3", name: "o3", reasoningType: "Thinking" ,},
      { id: "o4-mini", name: "o4-mini", reasoningType: "Thinking"},
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Creator of Claude, focused on AI safety and helpful, harmless, and honest AI assistants.",
    logoSrc: "/anthropic-logo-abstract.png",
    isAvailable: false, // Will be determined by the context
    models: [
      { id: "claude-3-5-sonnet-latest", name: "claude-3-5-sonnet-latest",  reasoningType: "Intelligence" },
      { id: "claude-3-7-sonnet-20250219", name: "claude-3-7-sonnet-20250219", reasoningType: "Thinking", isDefault: true, },
    ],
  },
]
