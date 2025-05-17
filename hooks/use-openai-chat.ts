"use client"

import { useState, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import type { CreateMessage, Message } from "@ai-sdk/react"
import type { Source , TokenUsage} from "@/lib/types"
import { nanoid } from "@/lib/nanoid"
import { useLlmProvider } from "@/contexts/llm-provider-context"

export function useOpenAIChat() {
  const { getSelectedModel } = useLlmProvider()
  const [sources, setSources] = useState<Source[]>([])
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
    api: "/api/chat/openai",
    id: chatId,
    generateId: nanoid,
    experimental_throttle: 50,
    body: {
      model: getSelectedModel("openai"),
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
          }
          if (item.type === "usage" && typeof item.usage === "object") {
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
                })
              }
            }
          }
      }
    }
  }, [data])

  const sendMessage = async (message: string | CreateMessage) => {
    setSources([])
    setTokenUsage(null)
    const userMessage =
      typeof message === "string"
        ? ({ role: "user", content: message, id: nanoid() } as Message)
        : ({ ...message, id: message.id || nanoid() } as Message)

    setOptimisticMessages((prev) => [...prev, userMessage])

    await append(userMessage, {
      body: {
        model: getSelectedModel("openai"),
      },
    })
  }

  const resetChat = useCallback(() => {
    setOptimisticMessages([])
    setSources([])
    setTokenUsage(null)
    setMessages([])
    setChatId(nanoid())
  }, [setMessages])

  return {
    messages,
    status,
    stop,
    sources,
    tokenUsage,
    sendMessage,
    chatId,
    resetChat,
  }
}
