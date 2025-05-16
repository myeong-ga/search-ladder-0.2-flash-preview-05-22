import type { CreateMessage } from "@ai-sdk/react"

export type Source = {
  url: string
  title: string
  cited_text?: string
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system" | "data"
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

export interface AnthropicMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  id?: string
}

export type ProviderType = "gemini" | "openai" | "anthropic"

export interface ModelInfo {
  id: string
  name: string
  isDefault?: boolean
}

export interface ProviderInfo {
  id: ProviderType
  name: string
  description: string
  logoSrc: string
  isAvailable: boolean
  models: ModelInfo[]
}

export type ChatStatus = "submitted" | "streaming" | "ready" | "error"

export interface ChatInterface {
  messages: Message[]
  status: ChatStatus
  stop: () => void
  sources: Source[]
  sendMessage: (message: string | CreateMessage) => Promise<void>
  searchSuggestions?: SearchSuggestion[]
  searchSuggestionsReasoning?: string
  searchSuggestionsConfidence?: number | null
  chatId: string
  resetChat: () => void
}
