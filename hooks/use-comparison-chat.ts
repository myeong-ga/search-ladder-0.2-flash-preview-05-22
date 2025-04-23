"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { type CreateMessage, type Message, useChat } from "@ai-sdk/react"
import type { Source } from "@/lib/types"
import { nanoid } from "@/lib/nanoid"

export interface SearchSuggestion {
  term: string
  confidence?: number
  reasoning?: string
}

export function useComparisonChat() {
  // Shared input state
  const [sharedInput, setSharedInput] = useState("")

  // Sources state
  const [googleSources, setGoogleSources] = useState<Source[]>([])
  const [openaiSources, setOpenaiSources] = useState<Source[]>([])

  // Search suggestions state
  const [googleSearchSuggestions, setGoogleSearchSuggestions] = useState<SearchSuggestion[]>([])
  const [searchSuggestionsReasoning, setSearchSuggestionsReasoning] = useState<string>("")
  const [searchSuggestionsConfidence, setSearchSuggestionsConfidence] = useState<number | null>(null)

  // Google chat state using useChat
  const {
    messages: googleMessages,
    isLoading: isGoogleLoading,
    stop: stopGoogle,
    data: googleData,
    append: appendGoogle,
    setMessages: setGoogleMessages,
  } = useChat({
    api: "/api/chat/google",
    id: "google-search-chat",
    generateId: nanoid,
    experimental_throttle: 50, // Add throttling to prevent too many updates
  })

  // OpenAI chat state using useChat
  const {
    messages: openaiMessages,
    isLoading: isOpenAILoading,
    stop: stopOpenAI,
    data: openaiData,
    append: appendOpenAI,
  } = useChat({
    api: "/api/chat/openai",
    id: "openai-search-chat",
    generateId: nanoid,
    experimental_throttle: 50, // Add throttling to prevent too many updates
  })

  // Extract sources, search suggestions, and cleaned text from Google data
  useEffect(() => {
    if (googleData && Array.isArray(googleData)) {
      // Process data items
      for (const item of googleData) {
        if (item && typeof item === "object" && "type" in item) {
          // Extract sources
          if (item.type === "sources" && "sources" in item && Array.isArray(item.sources)) {
            setGoogleSources(item.sources as Source[])
          }

          // Extract search suggestions
          if (item.type === "searchSuggestions") {
            if ("searchSuggestions" in item && Array.isArray(item.searchSuggestions)) {
              const suggestions = item.searchSuggestions.map((term) => ({ term }))
              setGoogleSearchSuggestions(suggestions as SearchSuggestion[])

              // Extract confidence and reasoning if available
              if ("confidence" in item && typeof item.confidence === "number") {
                setSearchSuggestionsConfidence(item.confidence)
              }

              if ("reasoning" in item && typeof item.reasoning === "string") {
                setSearchSuggestionsReasoning(item.reasoning)
              }
            }
          }

          // Handle cleaned text
          if (item.type === "cleaned-text" && "text" in item && typeof item.text === "string") {
            // Find the last assistant message and update its content
            setGoogleMessages((prevMessages) => {
              const newMessages = [...prevMessages]
              // Find the last assistant message
              for (let i = newMessages.length - 1; i >= 0; i--) {
                if (newMessages[i].role === "assistant") {
                  // Replace the content with cleaned text
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
  }, [googleData, setGoogleMessages])

  // Extract sources from OpenAI data
  useEffect(() => {
    if (openaiData && Array.isArray(openaiData)) {
      for (const item of openaiData) {
        if (item && typeof item === "object" && "type" in item && item.type === "sources") {
          if ("sources" in item && Array.isArray(item.sources)) {
            setOpenaiSources(item.sources as Source[])
            return
          }
        }
      }
    }
  }, [openaiData])

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSharedInput(e.target.value)
  }, [])

  // Handle search suggestion click
  const handleSearchSuggestionClick = useCallback((suggestion: string) => {
    setSharedInput(suggestion)
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()

      if (!sharedInput.trim() || (isGoogleLoading && isOpenAILoading)) return

      // Clear sources and search suggestions
      setGoogleSources([])
      setOpenaiSources([])
      setGoogleSearchSuggestions([])
      setSearchSuggestionsReasoning("")
      setSearchSuggestionsConfidence(null)

      // Submit to both models with proper typing
      const userMessage = { role: "user", content: sharedInput } as Message | CreateMessage
      await Promise.all([appendGoogle(userMessage), appendOpenAI(userMessage)])

      // Clear shared input
      setSharedInput("")
    },
    [sharedInput, isGoogleLoading, isOpenAILoading, appendGoogle, appendOpenAI],
  )

  // Stop generating
  const stopGenerating = useCallback(() => {
    stopGoogle()
    stopOpenAI()
  }, [stopGoogle, stopOpenAI])

  return {
    googleMessages,
    openaiMessages,
    googleSources,
    openaiSources,
    googleSearchSuggestions,
    searchSuggestionsReasoning,
    searchSuggestionsConfidence,
    isGoogleLoading,
    isOpenAILoading,
    input: sharedInput,
    handleInputChange,
    handleSearchSuggestionClick,
    handleSubmit,
    stopGenerating,
  }
}
