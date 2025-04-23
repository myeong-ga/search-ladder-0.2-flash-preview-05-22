import { ChatMessage } from "@/components/chat-message"
import { SourcesList } from "@/components/sources-list"
import { SearchSuggestions } from "@/components/search-suggestions"
import type { Message } from "ai"
import type { Source } from "@/lib/types"
import type { SearchSuggestion } from "@/hooks/use-comparison-chat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MobileComparisonViewProps {
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

export function MobileComparisonView({
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
}: MobileComparisonViewProps) {
  // Get the last message from each model (the response)
  // const lastGoogleMessage = googleMessages.length > 0 ? googleMessages[googleMessages.length - 1] : null
  // const lastOpenAIMessage = openaiMessages.length > 0 ? openaiMessages[openaiMessages.length - 1] : null

  return (
    <Tabs defaultValue="google" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="google">Google Gemini</TabsTrigger>
        <TabsTrigger value="openai">OpenAI</TabsTrigger>
      </TabsList>
      <TabsContent value="google" className="mt-2">
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
          {googleSources.length > 0 && <SourcesList sources={googleSources} />}
        </div>
      </TabsContent>
      <TabsContent value="openai" className="mt-2">
        <div className="space-y-4">
          {openaiMessages.length > 0 ? (
            <div className="divide-y">
              {openaiMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          ) : isOpenAILoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ) : (
            <p className="text-muted-foreground">No response yet</p>
          )}
          {openaiSources.length > 0 && <SourcesList sources={openaiSources} />}
          {googleSearchSuggestions.length > 0 && (
            <SearchSuggestions
              suggestions={googleSearchSuggestions}
              reasoning={searchSuggestionsReasoning}
              confidence={searchSuggestionsConfidence}
              onSuggestionClick={onSearchSuggestionClick}
            />
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
