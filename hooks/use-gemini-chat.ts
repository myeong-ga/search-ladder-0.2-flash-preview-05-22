"use client"

import { useState, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import type { CreateMessage, Message } from "@ai-sdk/react"
import type { Source , SearchSuggestion } from "@/lib/types"
import { nanoid } from "@/lib/nanoid"


export function useGeminiChat() {
  const [sources, setSources] = useState<Source[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
  const [searchSuggestionsReasoning, setSearchSuggestionsReasoning] = useState<string>("")
  const [searchSuggestionsConfidence, setSearchSuggestionsConfidence] = useState<number | null>(null)

  const { messages, isLoading, stop, data, append, setMessages } = useChat({
    api: "/api/chat/google",
    id: "google-search-chat",
    generateId: nanoid,
    experimental_throttle: 50,
  })

  useEffect(() => {
    if (data && Array.isArray(data)) {
      for (const item of data) {
        if (item && typeof item === "object" && "type" in item) {
          if (item.type === "sources" && "sources" in item && Array.isArray(item.sources)) {
            setSources(item.sources as Source[])
          }

          if (item.type === "searchSuggestions") {
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
          }

          if (item.type === "cleaned-text" && "text" in item && typeof item.text === "string") {
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

    const userMessage =
      typeof message === "string" ? ({ role: "user", content: message } as Message | CreateMessage) : message

    await append(userMessage)
  }

  return {
    messages,
    isLoading,
    stop,
    sources,
    searchSuggestions,
    searchSuggestionsReasoning,
    searchSuggestionsConfidence,
    sendMessage,
  }
}
