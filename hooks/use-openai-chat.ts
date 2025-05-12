"use client"

import { useState, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import type { CreateMessage, Message } from "@ai-sdk/react"
import type { Source } from "@/lib/types"
import { nanoid } from "@/lib/nanoid"

export function useOpenAIChat() {
  const [sources, setSources] = useState<Source[]>([])

  const { messages, isLoading, stop, data, append } = useChat({
    api: "/api/chat/openai",
    id: "openai-search-chat",
    generateId: nanoid,
    experimental_throttle: 50,
  })

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
      typeof message === "string" ? ({ role: "user", content: message } as Message | CreateMessage) : message

    await append(userMessage)
  }

  return {
    messages,
    isLoading,
    stop,
    sources,
    sendMessage,
  }
}
