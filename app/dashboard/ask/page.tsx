"use client"

import { SelectChatModel } from "@/components/select-chat-model"
import { ApiKeyWarning } from "@/components/api-key-warning"
import { useLlmProvider } from "@/contexts/llm-provider-context"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function Home() {
  const { providers, isLoading } = useLlmProvider()

  // Check which providers are missing
  const missingProviders = {
    google: providers.find((p: { id: string }) => p.id === "gemini")?.isAvailable === false,
    openai: providers.find((p: { id: string }) => p.id === "openai")?.isAvailable === false,
  }

  const isAnyProviderMissing = missingProviders.google || missingProviders.openai

  return (
    <DashboardLayout>
       <div className="py-1">
        {isAnyProviderMissing && !isLoading && <ApiKeyWarning missingProviders={missingProviders} />}
        <SelectChatModel />
      </div>
    </DashboardLayout>

  )
}



