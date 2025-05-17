import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TokenUsage } from "@/lib/types"

interface TokenUsageDisplayProps {
  tokenUsage: TokenUsage | null | undefined
  modelName?: string
}

export function TokenUsageDisplay({ tokenUsage, modelName }: TokenUsageDisplayProps) {
  if (!tokenUsage) return null

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Token Usage {modelName && `(${modelName})`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Prompt</span>
            <span className="font-mono">{tokenUsage.promptTokens.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-mono">{tokenUsage.completionTokens.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Total</span>
            <span className="font-mono">{tokenUsage.totalTokens.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
