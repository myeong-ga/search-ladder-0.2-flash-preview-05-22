"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ProviderInfo, ProviderType } from "@/lib/types"
import { providers as initialProviders } from "@/lib/providers"

interface LlmProviderContextType {
  providers: ProviderInfo[]
  isLoading: boolean
  checkAvailability: () => Promise<void>
  updateSelectedModel: (providerId: ProviderType, modelId: string) => void
  getSelectedModel: (providerId: ProviderType) => string | undefined
}

const LlmProviderContext = createContext<LlmProviderContextType | undefined>(undefined)

export function LlmProviderContextProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<ProviderInfo[]>(initialProviders)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedModels, setSelectedModels] = useState<Record<ProviderType, string>>({
    gemini: "gemini-2.5-flash-preview-04-17",
    openai: "gpt-4o-mini",
    anthropic: "claude-3-5-sonnet-20241022",
  })

  const checkAvailability = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/check-availability")
      if (response.ok) {
        const data = await response.json()

        setProviders((currentProviders) =>
          currentProviders.map((provider) => ({
            ...provider,
            isAvailable: data[provider.id] || false,
          })),
        )
      }
    } catch (error) {
      console.error("Failed to check API availability:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSelectedModel = (providerId: ProviderType, modelId: string) => {
    setSelectedModels((prev) => ({
      ...prev,
      [providerId]: modelId,
    }))
  }

  const getSelectedModel = (providerId: ProviderType) => {
    return selectedModels[providerId]
  }

  useEffect(() => {
    checkAvailability()
  }, [])

  return (
    <LlmProviderContext.Provider
      value={{
        providers,
        isLoading,
        checkAvailability,
        updateSelectedModel,
        getSelectedModel,
      }}
    >
      {children}
    </LlmProviderContext.Provider>
  )
}

export function useLlmProvider() {
  const context = useContext(LlmProviderContext)
  if (context === undefined) {
    throw new Error("useLlmProvider must be used within a LlmProviderContextProvider")
  }
  return context
}
