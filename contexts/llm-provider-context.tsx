"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ProviderInfo, ProviderType } from "@/lib/types"
import { providers as initialProviders } from "@/lib/providers"
import Cookies from "js-cookie"

interface LlmProviderContextType {
  providers: ProviderInfo[]
  isLoading: boolean
  checkAvailability: () => Promise<void>
  updateSelectedModel: (providerId: ProviderType, modelId: string) => void
  getSelectedModel: (providerId: ProviderType) => string
}

const LlmProviderContext = createContext<LlmProviderContextType | undefined>(undefined)

export function LlmProviderContextProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<ProviderInfo[]>(initialProviders)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedModels, setSelectedModels] = useState<Record<ProviderType, string>>(() => {
    // Initialize with default models
    const defaults: Record<ProviderType, string> = {
      gemini: "",
      openai: "",
      anthropic: "",
    }

    // Set default models from providers
    initialProviders.forEach((provider) => {
      const defaultModel = provider.models.find((model) => model.isDefault)
      if (defaultModel) {
        defaults[provider.id] = defaultModel.id
      } else if (provider.models.length > 0) {
        defaults[provider.id] = provider.models[0].id
      }
    })

    return defaults
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

    // Save to cookies for server-side access
    try {
      // Set cookie with provider-specific name
      const cookieName = `selected${providerId.charAt(0).toUpperCase() + providerId.slice(1)}Model`
      Cookies.set(cookieName, modelId, { expires: 30 }) // Expires in 30 days
    } catch (error) {
      console.error(`Failed to set cookie for ${providerId} model:`, error)
    }
  }

  const getSelectedModel = (providerId: ProviderType): string => {
    return selectedModels[providerId] || ""
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
