"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon, Loader2 } from "lucide-react"
import type { ProviderType } from "@/lib/types"
import { SingleChat } from "./single-chat"
import { useLlmProvider } from "@/contexts/llm-provider-context"

export function SelectResearchModel() {
  const { providers, isLoading } = useLlmProvider()
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | null>(null)
  const [hasStarted, setHasStarted] = useState(false)

  const handleProviderSelect = (providerId: ProviderType) => {
    setSelectedProvider(providerId)
  }

  const handleStart = () => {
    if (selectedProvider) {
      setHasStarted(true)
    }
  }

  if (hasStarted && selectedProvider) {
    return <SingleChat initialProviderId={selectedProvider} />
  }

  if (isLoading) {
    return (
      <div className="container py-8 max-w-3xl mx-auto flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking API availability...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Select Research Model</CardTitle>
          <CardDescription>Choose an AI model for your research</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <Card
                key={provider.id}
                className={`cursor-pointer transition-all ${
                  selectedProvider === provider.id ? "border-primary ring-2 ring-primary ring-opacity-50" : ""
                } ${!provider.isAvailable ? "opacity-50" : ""}`}
                onClick={() => provider.isAvailable && handleProviderSelect(provider.id as ProviderType)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={provider.logoSrc || "/placeholder.svg"}
                          alt={provider.name}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" tabIndex={-1}>
                            <InfoIcon className="h-4 w-4" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p>{provider.description}</p>
                          {!provider.isAvailable && (
                            <p className="text-destructive mt-2">
                              {provider.id === "anthropic"
                                ? "Coming soon in the next iteration"
                                : "API key not configured"}
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{provider.description.split(".")[0]}.</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  {selectedProvider === provider.id && <div className="text-xs font-medium text-primary">Selected</div>}
                  {!provider.isAvailable && <div className="text-xs text-muted-foreground">Not available</div>}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleStart} disabled={!selectedProvider} size="lg" className="px-8">
            Start Research
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
