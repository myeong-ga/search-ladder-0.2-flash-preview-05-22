"use client"

import { useState, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import type { CreateMessage, Message } from "@ai-sdk/react"
import type { Source } from "@/lib/types"
import { nanoid } from "@/lib/nanoid"
import { useLlmProvider } from "@/contexts/llm-provider-context"

export function useOpenAIChat() {
  const { getSelectedModel } = useLlmProvider()
  const [sources, setSources] = useState<Source[]>([])
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([])
  const [chatId, setChatId] = useState<string>(() => nanoid())

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
        if (item && typeof item === "object" && "type" in item && item.type === "sources") {
          if ("sources" in item && Array.isArray(item.sources)) {
            setSources(item.sources as Source[])
            return
          }
        }
      }
    }
  }, [data])

  const sendMessage = async (message: string | CreateMessage) => {
    setSources([])

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
    setMessages([])
    setChatId(nanoid())
  }, [setMessages])

  return {
    messages,
    status,
    stop,
    sources,
    sendMessage,
    chatId,
    resetChat,
  }
}
