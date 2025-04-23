"use client"

import type React from "react"
import { useRef } from "react"
import { useComparisonChat } from "@/hooks/use-comparison-chat"
import { ComparisonView } from "@/components/comparison-view"
import { MobileComparisonView } from "@/components/mobile-comparison-view"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, StopCircle } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export function ComparisonChat() {
  const {
    googleMessages,
    openaiMessages,
    googleSources,
    openaiSources,
    googleSearchSuggestions,
    searchSuggestionsReasoning,
    searchSuggestionsConfidence,
    isGoogleLoading,
    isOpenAILoading,
    input,
    handleInputChange,
    handleSearchSuggestionClick,
    handleSubmit,
    stopGenerating,
  } = useComparisonChat()

  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isLoading = isGoogleLoading || isOpenAILoading
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Handle Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      formRef.current?.requestSubmit()
    }
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 overflow-y-auto pb-32 pt-4  min-w-[768px] lg:min-w-[1024px]">
        {googleMessages.length === 0 && openaiMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-3 max-w-md px-4">
              <h2 className="text-2xl font-bold">Search Model Comparison</h2>
              <p className="text-muted-foreground">
                Compare search results from Google Gemini and OpenAI side by side.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isMobile ? (
              <MobileComparisonView
                googleMessages={googleMessages}
                openaiMessages={openaiMessages}
                googleSources={googleSources}
                openaiSources={openaiSources}
                googleSearchSuggestions={googleSearchSuggestions}
                searchSuggestionsReasoning={searchSuggestionsReasoning}
                searchSuggestionsConfidence={searchSuggestionsConfidence}
                onSearchSuggestionClick={handleSearchSuggestionClick}
                isGoogleLoading={isGoogleLoading}
                isOpenAILoading={isOpenAILoading}
              />
            ) : (
              <ComparisonView
                googleMessages={googleMessages}
                openaiMessages={openaiMessages}
                googleSources={googleSources}
                openaiSources={openaiSources}
                googleSearchSuggestions={googleSearchSuggestions}
                searchSuggestionsReasoning={searchSuggestionsReasoning}
                searchSuggestionsConfidence={searchSuggestionsConfidence}
                onSearchSuggestionClick={handleSearchSuggestionClick}
                isGoogleLoading={isGoogleLoading}
                isOpenAILoading={isOpenAILoading}
              />
            )}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 w-full bg-background border-t p-4 flex justify-center shadow-md">
        <div className="w-full max-w-[1200px] mx-auto px-4 flex justify-center">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 w-full max-w-[700px] min-w-[300px] md:min-w-[500px]"
          >
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="min-h-24 resize-none pr-20"
                disabled={isLoading}
              />
              <div className="absolute right-2 bottom-2">
                {isLoading ? (
                  <Button type="button" size="icon" variant="ghost" onClick={stopGenerating} className="h-8 w-8">
                    <StopCircle className="h-4 w-4" />
                    <span className="sr-only">Stop generating</span>
                  </Button>
                ) : (
                  <Button type="submit" size="icon" disabled={!input.trim()} className="h-8 w-8">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                )}
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              Press <kbd className="rounded border px-1 py-0.5 bg-muted">Ctrl</kbd> +{" "}
              <kbd className="rounded border px-1 py-0.5 bg-muted">Enter</kbd> to send
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
