"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ApiKeyWarningProps {
  missingProviders: {
    google?: boolean
    openai?: boolean
  }
}

export function ApiKeyWarning({ missingProviders }: ApiKeyWarningProps) {
  const [dismissed, setDismissed] = useState(false)

  const isGoogleMissing = missingProviders.google
  const isOpenAIMissing = missingProviders.openai

  if (dismissed) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing API Keys</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          {isGoogleMissing && isOpenAIMissing
            ? "Both Google and OpenAI API keys are missing."
            : isGoogleMissing
              ? "Google API key is missing."
              : "OpenAI API key is missing."}{" "}
          The comparison chatbot requires API keys to function correctly.
        </p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={() => setDismissed(true)}>
            Dismiss
          </Button>
          {isGoogleMissing && (
            <Button size="sm" onClick={() => window.open("https://ai.google.dev/", "_blank")}>
              Get Google API Key
            </Button>
          )}
          {isOpenAIMissing && (
            <Button size="sm" onClick={() => window.open("https://platform.openai.com/", "_blank")}>
              Get OpenAI API Key
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
