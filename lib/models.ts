import type { ModelConfigInfo } from "./types"

export const DEFAULT_MODEL_CONFIG = {
  temperature: 0.2,
  topP: 0.8,
  maxTokens: 4000,
}
export const DEFAULT_THINKING_CONFIG = {
  temperature: 1,
  // topP: 0.8,
  maxTokens: 6000,
}
export const model_config: ModelConfigInfo[] = [
  // Gemini models
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "Google's fast and efficient multimodal AI model.",
    config: { ...DEFAULT_MODEL_CONFIG },
  },
  {
    id: "gemini-2.5-flash-preview-04-17",
    name: "Gemini 2.5 Flash Preview",
    description: "Preview version of Google's advanced multimodal AI model.",
    config: { ...DEFAULT_MODEL_CONFIG },
  },
  {
    id: "gemini-2.5-pro-preview-05-06",
    name: "Gemini 2.5 Pro Preview",
    description: "Preview version of Google's most capable multimodal AI model.",
    config: { ...DEFAULT_MODEL_CONFIG },
  },

  // OpenAI models
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    description: "Smaller, faster version of OpenAI's GPT-4.1 model.",
    config: { ...DEFAULT_MODEL_CONFIG },
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    description: "OpenAI's most advanced large language model.",
    config: { ...DEFAULT_MODEL_CONFIG },
  },

  // Anthropic models
  {
    id: "claude-3-5-sonnet-latest",
    name: "Claude 3.5 Sonnet",
    description: "Anthropic's advanced AI assistant focused on helpfulness and safety.",
    config: { ...DEFAULT_MODEL_CONFIG },
  },
  {
    id: "claude-3-7-sonnet-20250219",
    name: "Claude 3.7 Sonnet",
    description: "Anthropic's most capable AI assistant with enhanced reasoning abilities.",
    config: { ...DEFAULT_MODEL_CONFIG },
  },
]

export function getModelConfigById(modelId: string): ModelConfigInfo | undefined {
  return model_config.find((model) => model.id === modelId)
}

export function getDefaultModelConfig(modelId: string): ModelConfigInfo {
  const modelConfig = getModelConfigById(modelId)
  if (modelConfig) {
    return modelConfig
  }

  // Return a default config if model not found
  return {
    id: modelId,
    name: modelId,
    description: "Model configuration not found",
    config: { ...DEFAULT_MODEL_CONFIG },
  }
}
