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

export interface ModelMessage {
  role: "user" | "assistant" | "system"
  content: string
  id?: string
  name?: string
}

export interface AnthropicModelMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export type ProviderType = "gemini" | "openai" | "anthropic"
export type ReasoningType = "Reasoning" | "Thinking" | "Intelligence" | undefined

export interface ModelInfo {
  id: string
  name: string
  isDefault?: boolean
  reasoningType?: ReasoningType
}

export interface ProviderInfo {
  id: string
  name: string
  description: string
  logoSrc: string
  isAvailable: boolean
  models: ModelInfo[]
}

export type ChatStatus = "submitted" | "streaming" | "ready" | "error"

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  finishReason?: string
}

export interface CreateMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ChatInterface {
  messages: Message[]
  status: ChatStatus
  stop: () => void
  sources: Source[]
  sendMessage: (message: string ) => Promise<void>
  searchSuggestions?: SearchSuggestion[]
  searchSuggestionsReasoning?: string
  searchSuggestionsConfidence?: number | null
  chatId: string
  resetChat: () => void
  tokenUsage?: TokenUsage | null
  modelConfig: ModelConfig
  uiModelConfig: ModelConfig | null
  responseSelectModel: string | null
  responseReasoningType: string | null
  updateModelConfig: (config: Partial<ModelConfig>, showToast?: boolean) => void
}

export interface ModelConfig {
  temperature: number
  topP: number
  maxTokens: number
}

export interface ModelConfigInfo {
  id: string
  name: string
  description: string
  config: ModelConfig
}
