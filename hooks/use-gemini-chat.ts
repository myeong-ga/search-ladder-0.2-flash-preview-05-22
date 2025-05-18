"use client"

import { useState, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import type { CreateMessage, Message } from "@ai-sdk/react"
import type { Source, TokenUsage } from "@/lib/types"
import { nanoid } from "@/lib/nanoid"
import type { SearchSuggestion } from "@/lib/types"
import { useLlmProvider } from "@/contexts/llm-provider-context"

export function useGeminiChat() {
  const { getSelectedModel } = useLlmProvider()
  const [sources, setSources] = useState<Source[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
  const [searchSuggestionsReasoning, setSearchSuggestionsReasoning] = useState<string>("")
  const [searchSuggestionsConfidence, setSearchSuggestionsConfidence] = useState<number | null>(null)
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([])
  const [chatId, setChatId] = useState<string>(() => nanoid())
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null)

  const {
    messages: chatMessages,
    status,
    stop,
    data,
    append,
    setMessages,
  } = useChat({
    api: "/api/chat/google",
    id: chatId,
    generateId: nanoid,
    experimental_throttle: 50,
    body: {
      model: getSelectedModel("gemini"),
    },
  })

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
          } else if (item.type === "usage" && typeof item.usage === "object") {
            const usage = item.usage as any
            if (
              typeof usage.promptTokens === "number" &&
              typeof usage.completionTokens === "number" &&
              typeof usage.totalTokens === "number"
            ) {
              setTokenUsage({
                promptTokens: usage.promptTokens,
                completionTokens: usage.completionTokens,
                totalTokens: usage.totalTokens,
                finishReason: usage.finishReason || "unknown",
              })
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

  const sendMessage = async (message: string | CreateMessage) => {
    setSources([])
    setSearchSuggestions([])
    setSearchSuggestionsReasoning("")
    setSearchSuggestionsConfidence(null)
    setTokenUsage(null)

    const userMessage =
      typeof message === "string"
        ? ({ role: "user", content: message, id: nanoid() } as Message)
        : ({ ...message, id: message.id || nanoid() } as Message)

    setOptimisticMessages((prev) => [...prev, userMessage])

    await append(userMessage, {
      body: {
        model: getSelectedModel("gemini"),
      },
    })
  }

  const resetChat = useCallback(() => {
    setOptimisticMessages([])
    setSources([])
    setSearchSuggestions([])
    setSearchSuggestionsReasoning("")
    setSearchSuggestionsConfidence(null)
    setMessages([])
    setChatId(nanoid())
    setTokenUsage(null)
  }, [setMessages])

  return {
    messages,
    status,
    stop,
    tokenUsage,
    sources,
    searchSuggestions,
    searchSuggestionsReasoning,
    searchSuggestionsConfidence,
    sendMessage,
    chatId,
    resetChat,
  }
}
