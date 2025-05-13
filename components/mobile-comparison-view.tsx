import { ChatMessage } from "@/components/chat-message"
import { SourcesList } from "@/components/sources-list"
import { SearchSuggestions } from "@/components/search-suggestions"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ProviderType, ChatInterface } from "@/lib/types"
import { ModelSelector } from "@/components/model-selector"

interface ProviderProps {
  id: ProviderType
  name: string
  chat: ChatInterface | null
  isActive: boolean
  toggleActive: () => void
}

interface MobileComparisonViewProps {
  firstProvider: ProviderProps
  secondProvider: ProviderProps
  onSearchSuggestionClick: (suggestion: string) => void
}

export function MobileComparisonView({
  firstProvider,
  secondProvider,
  onSearchSuggestionClick,
}: MobileComparisonViewProps) {
  return (
    <Tabs defaultValue="first" className="w-full h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="first" className="flex justify-between items-center">
          <span>{firstProvider.name}</span>
          <div className="flex items-center space-x-2 ml-2">
            <Switch
              id="first-provider-active-mobile"
              checked={firstProvider.isActive}
              onCheckedChange={firstProvider.toggleActive}
              disabled={firstProvider.chat?.isLoading}
            />
          </div>
        </TabsTrigger>
        <TabsTrigger value="second" className="flex justify-between items-center">
          <span>{secondProvider.name}</span>
          <div className="flex items-center space-x-2 ml-2">
            <Switch
              id="second-provider-active-mobile"
              checked={secondProvider.isActive}
              onCheckedChange={secondProvider.toggleActive}
              disabled={secondProvider.chat?.isLoading}
            />
          </div>
        </TabsTrigger>
      </TabsList>
      <div className="p-2">
        <ModelSelector providerId={firstProvider.id} />
        <ModelSelector providerId={secondProvider.id} />
      </div>
      <TabsContent value="first" className="mt-2 h-[calc(100vh-20rem)] overflow-y-auto">
        <div className={`space-y-4 ${!firstProvider.isActive ? "opacity-50" : ""}`}>
          {firstProvider.chat?.messages && firstProvider.chat.messages.length > 0 ? (
            <div className="divide-y">
              {firstProvider.chat.messages.map((message: any) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          ) : firstProvider.chat?.isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ) : (
            <p className="text-muted-foreground">No response yet</p>
          )}
          {firstProvider.chat?.sources && firstProvider.chat.sources.length > 0 && (
            <SourcesList sources={firstProvider.chat.sources} />
          )}
          {firstProvider.id === "gemini" &&
            firstProvider.chat?.searchSuggestions &&
            firstProvider.chat.searchSuggestions.length > 0 && (
              <SearchSuggestions
                suggestions={firstProvider.chat.searchSuggestions}
                reasoning={firstProvider.chat.searchSuggestionsReasoning}
                confidence={firstProvider.chat.searchSuggestionsConfidence}
                onSuggestionClick={onSearchSuggestionClick}
              />
            )}
        </div>
      </TabsContent>
      <TabsContent value="second" className="mt-2 h-[calc(100vh-20rem)] overflow-y-auto">
        <div className={`space-y-4 ${!secondProvider.isActive ? "opacity-50" : ""}`}>
          {secondProvider.chat?.messages && secondProvider.chat.messages.length > 0 ? (
            <div className="divide-y">
              {secondProvider.chat.messages.map((message: any) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          ) : secondProvider.chat?.isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ) : (
            <p className="text-muted-foreground">No response yet</p>
          )}
          {secondProvider.chat?.sources && secondProvider.chat.sources.length > 0 && (
            <SourcesList sources={secondProvider.chat.sources} />
          )}
          {secondProvider.id === "gemini" &&
            secondProvider.chat?.searchSuggestions &&
            secondProvider.chat.searchSuggestions.length > 0 && (
              <SearchSuggestions
                suggestions={secondProvider.chat.searchSuggestions}
                reasoning={secondProvider.chat.searchSuggestionsReasoning}
                confidence={secondProvider.chat.searchSuggestionsConfidence}
                onSuggestionClick={onSearchSuggestionClick}
              />
            )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
