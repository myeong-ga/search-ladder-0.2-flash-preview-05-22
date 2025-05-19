"use client"

import { useState, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import type { CreateMessage, Message } from "@ai-sdk/react"
import type { SearchSuggestion, Source, TokenUsage, ModelConfig } from "@/lib/types"
import { nanoid } from "@/lib/nanoid"
import { useLlmProvider } from "@/contexts/llm-provider-context"
import { getDefaultModelConfig } from "@/lib/models"
import { toast } from "sonner"

export function useOpenAIChat() {
  const { getSelectedModel } = useLlmProvider()
  const [sources, setSources] = useState<Source[]>([])
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
  const [searchSuggestionsReasoning, setSearchSuggestionsReasoning] = useState<string>("")
  const [searchSuggestionsConfidence, setSearchSuggestionsConfidence] = useState<number | null>(null)
  const [chatId, setChatId] = useState<string>(() => nanoid())
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null)
  const [modelConfig, setModelConfig] = useState<ModelConfig>(() => {
    const selectedModelId = getSelectedModel("openai")
    return getDefaultModelConfig(selectedModelId).config
  })
  const [uiModelConfig, setUiModelConfig] = useState<ModelConfig | null>(null) // 마지막 응답에서 확인할 수 있는 model config , chatting 창 message display 와 함께 사용된다

  const {
    messages: chatMessages,
    status,
    stop,
    data,
    append,
    setMessages,
  } = useChat({
    api: "/api/chat/openai",
    id: chatId,
    generateId: nanoid,
    experimental_throttle: 50,
    body: {
      model: getSelectedModel("openai"),
      modelConfig,
    },
  })

  // Update model config when selected model changes
  useEffect(() => {
    const selectedModelId = getSelectedModel("openai")
    const defaultConfig = getDefaultModelConfig(selectedModelId).config
    setModelConfig(defaultConfig)
  }, [getSelectedModel])

  const messages = [
    ...optimisticMessages,
    ...chatMessages.filter((chatMsg) => !optimisticMessages.some((optMsg) => optMsg.id === chatMsg.id)),
  ]

  useEffect(() => {
    if (chatMessages.length > 0) {
      setOptimisticMessages((prev) =>
        prev.filter((optMsg) => !chatMessages.some((chatMsg) => chatMsg.id === optMsg.id)),
      )
    }
  }, [chatMessages])

  useEffect(() => {
    if (data && Array.isArray(data)) {
      for (const item of data) {
        if (item && typeof item === "object" && "type" in item) {
          if (item.type === "sources" && "sources" in item && Array.isArray(item.sources)) {
            setSources(item.sources as Source[])
          } else if (item.type === "usage" && typeof item.usage === "object") {
            const usage = item.usage as any
            if (
              typeof usage.prompt_tokens === "number" &&
              typeof usage.completion_tokens === "number" &&
              typeof usage.total_tokens === "number"
            ) {
              setTokenUsage({
                promptTokens: usage.prompt_tokens,
                completionTokens: usage.completion_tokens,
                totalTokens: usage.total_tokens,
                finishReason: usage.finishReason || "unknown",
              })
            }
          } else if (item.type === "model-config" && typeof item.config === "object") {
            // Handle model config response from server
            const config = item.config as unknown as ModelConfig
            if (
              typeof config.temperature === "number" &&
              typeof config.topP === "number" &&
              typeof config.maxTokens === "number"
            ) {
              setUiModelConfig(config)
            }
          } else if (item.type === "searchSuggestions") {
            if ("searchSuggestions" in item && Array.isArray(item.searchSuggestions)) {
              const suggestions = item.searchSuggestions.map((term) => ({ term }))
              setSearchSuggestions(suggestions as SearchSuggestion[])

              if ("confidence" in item && typeof item.confidence === "number") {
                setSearchSuggestionsConfidence(item.confidence)
              }

              if ("reasoning" in item && typeof item.reasoning === "string") {
                setSearchSuggestionsReasoning(item.reasoning)
              }
            }
          } else if (item.type === "cleaned-text" && "text" in item && typeof item.text === "string") {
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages]
              for (let i = newMessages.length - 1; i >= 0; i--) {
                if (newMessages[i].role === "assistant") {
                  newMessages[i] = {
                    ...newMessages[i],
                    content: item.text as string,
                  }
                  break
                }
              }
              return newMessages
            })
          }
        }
      }
    }
  }, [data, setMessages])

  const updateModelConfig = useCallback((config: Partial<ModelConfig>, showToast = false) => {
    setModelConfig((prevConfig) => {
      const newConfig = {
        ...prevConfig,
        ...config,
      }

      if (showToast) {
        toast.success("Model configuration updated", {
          description: `Temperature: ${newConfig.temperature.toFixed(2)}, Top P: ${newConfig.topP.toFixed(2)}, Max Tokens: ${newConfig.maxTokens}`,
          duration: 3000,
        })
      }

      return newConfig
    })
  }, [])

  const sendMessage = async (message: string | CreateMessage) => {
    setSources([])
    setTokenUsage(null)
    setUiModelConfig(null)
    const userMessage =
      typeof message === "string"
        ? ({ role: "user", content: message, id: nanoid() } as Message)
        : ({ ...message, id: message.id || nanoid() } as Message)

    setOptimisticMessages((prev) => [...prev, userMessage])

    await append(userMessage, {
      body: {
        model: getSelectedModel("openai"),
        modelConfig,
      },
    })
  }

  const resetChat = useCallback(() => {
    setOptimisticMessages([])
    setSources([])
    setTokenUsage(null)
    setUiModelConfig(null)
    setMessages([])
    setChatId(nanoid())

    // Reset model config to default
    const selectedModelId = getSelectedModel("openai")
    setModelConfig(getDefaultModelConfig(selectedModelId).config)
  }, [setMessages, getSelectedModel])

  return {
    messages,
    status,
    stop,
    sources,
    tokenUsage,
    searchSuggestions,
    searchSuggestionsReasoning,
    searchSuggestionsConfidence,
    sendMessage,
    chatId,
    resetChat,
    modelConfig,
    uiModelConfig,
    updateModelConfig,
  }
}
