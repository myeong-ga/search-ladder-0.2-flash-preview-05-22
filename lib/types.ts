export type Source = {
  url: string
  title: string
  cited_text?: string
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export interface SearchSuggestion {
  term: string
  confidence?: number
  reasoning?: string
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  id?: string
  name?: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  id?: string
}

export type ProviderType = "gemini" | "openai" | "anthropic"

export interface ProviderInfo {
  id: ProviderType
  name: string
  description: string
  logoSrc: string
  isAvailable: boolean
}

export interface ModelInfo {
  id: string
  name: string
  description: string
  provider: ProviderType
  isDefault?: boolean
}
