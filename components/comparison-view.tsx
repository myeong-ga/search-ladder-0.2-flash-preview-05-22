import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatMessage } from "@/components/chat-message"
import { SourcesList } from "@/components/sources-list"
import type { Message } from "ai"
import type { Source } from "@/lib/types"
import { SearchSuggestions } from "@/components/search-suggestions"
import type { SearchSuggestion } from "@/hooks/use-comparison-chat"

interface ComparisonViewProps {
  googleMessages: Message[]
  openaiMessages: Message[]
  googleSources: Source[]
  openaiSources: Source[]
  googleSearchSuggestions: SearchSuggestion[]
  searchSuggestionsReasoning?: string
  searchSuggestionsConfidence?: number | null
  isGoogleLoading: boolean
  isOpenAILoading: boolean
  onSearchSuggestionClick: (suggestion: string) => void
}

export function ComparisonView({
  googleMessages,
  openaiMessages,
  googleSources,
  openaiSources,
  googleSearchSuggestions,
  searchSuggestionsReasoning,
  searchSuggestionsConfidence,
  isGoogleLoading,
  isOpenAILoading,
  onSearchSuggestionClick,
}: ComparisonViewProps) {
  // Get the last message from each model (the response)
  // const lastGoogleMessage = googleMessages.length > 0 ? googleMessages[googleMessages.length - 1] : null
  // const lastOpenAIMessage = openaiMessages.length > 0 ? openaiMessages[openaiMessages.length - 1] : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-[1200px] mx-auto px-4">
      {/* Google Gemini Column */}
      <div className="flex justify-center">
        <Card className="h-full flex flex-col w-full max-w-[578px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Google Gemini</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {googleMessages.length > 0 ? (
              <div className="divide-y">
                {googleMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
              ) : isGoogleLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ) : (
                <p className="text-muted-foreground">No response yet</p>
              )}
             
              {googleSearchSuggestions.length > 0 && (
                <SearchSuggestions
                  suggestions={googleSearchSuggestions}
                  reasoning={searchSuggestionsReasoning}
                  confidence={searchSuggestionsConfidence}
                  onSuggestionClick={onSearchSuggestionClick}
                />
              )}

              {googleSources.length > 0 && <SourcesList sources={googleSources} />}
              
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OpenAI Column */}
      <div className="flex justify-center">
        <Card className="h-full flex flex-col w-full max-w-[578px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">OpenAI</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {openaiMessages.length > 0 ? (
              <div className="divide-y">
                {openaiMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
              ) : (
                <p className="text-muted-foreground">No response yet</p>
              )}
              {openaiSources.length > 0 && <SourcesList sources={openaiSources} />}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
