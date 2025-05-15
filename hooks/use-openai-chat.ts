"use client"

import { useState, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import type { CreateMessage, Message } from "@ai-sdk/react"
import type { Source } from "@/lib/types"
import { nanoid } from "@/lib/nanoid"
import { useLlmProvider } from "@/contexts/llm-provider-context"

export function useOpenAIChat() {
  const { getSelectedModel } = useLlmProvider()
  const [sources, setSources] = useState<Source[]>([])

  const { messages, status, stop, data, append } = useChat({
    api: "/api/chat/openai",
    id: "openai-search-chat",
    generateId: nanoid,
    experimental_throttle: 50,
    body: {
      model: getSelectedModel("openai"),
    },
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

    await append(userMessage, {
      body: {
        model: getSelectedModel("openai"),
      },
    })
  }

  return {
    messages,
    status,
    stop,
    sources,
    sendMessage,
  }
}
