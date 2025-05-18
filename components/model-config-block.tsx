"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModelConfigDialog } from "./model-config-dialog"
import type { ChatInterface, ModelConfig, ProviderType } from "@/lib/types"
import { useLlmProvider } from "@/contexts/llm-provider-context"
import { useEffect, useState } from "react"

interface ModelConfigBlockProps {
  chat: ChatInterface | null
  providerId: ProviderType
}

export function ModelConfigBlock({ chat ,providerId}: ModelConfigBlockProps) {


  const { getSelectedModel, providers } = useLlmProvider()


  if (!chat?.modelConfig) return null

  const selectedModelId = getSelectedModel(providerId)
  const provider = providers.find((p) => p.id === providerId)
  const model = provider?.models.find((m) => m.id === selectedModelId)
  const modelName = model?.name || selectedModelId

  const handleConfigChange = (config: ModelConfig) => {
    if (chat?.updateModelConfig) {
      chat.updateModelConfig(config)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Model Configuration  {modelName && `(${modelName})`}</CardTitle>
        <ModelConfigDialog
          config={chat.modelConfig}
          onConfigChange={handleConfigChange}
          disabled={chat.status === "streaming" || chat.status === "submitted"}
          buttonClassName="h-6 w-6"
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Temperature</span>
            <span className="font-mono">{chat.modelConfig.temperature.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Top P</span>
            <span className="font-mono">{chat.modelConfig.topP.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Max Tokens</span>
            <span className="font-mono">{chat.modelConfig.maxTokens.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
