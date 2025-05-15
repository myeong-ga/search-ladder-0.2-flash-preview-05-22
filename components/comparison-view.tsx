import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatMessage } from "@/components/chat-message"
import { SourcesList } from "@/components/sources-list"
import { SearchSuggestions } from "@/components/search-suggestions"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { ProviderType, ChatInterface } from "@/lib/types"
import { ModelSelector } from "@/components/model-selector"
import { LikeButton } from "@/components/like-button"
import { TextShimmerLoader } from "./TextShimmerLoader"

interface ProviderProps {
  id: ProviderType
  name: string
  chat: ChatInterface | null
  isActive: boolean
  toggleActive: () => void
}

interface ComparisonViewProps {
  firstProvider: ProviderProps
  secondProvider: ProviderProps
  onSearchSuggestionClick: (suggestion: string) => void
}

export function ComparisonView({ firstProvider, secondProvider, onSearchSuggestionClick }: ComparisonViewProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <Card className={`h-full flex flex-col ${!firstProvider.isActive ? "opacity-50" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{firstProvider.name}</CardTitle>
              <LikeButton initialCount={Math.floor(Math.random() * 200) + 100} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="first-provider-active"
                checked={firstProvider.isActive}
                onCheckedChange={firstProvider.toggleActive}
                disabled={firstProvider.chat?.status === "streaming" || firstProvider.chat?.status === "submitted"}
              />
              <Label htmlFor="first-provider-active">Active</Label>
            </div>
          </div>
          <ModelSelector providerId={firstProvider.id} />
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto h-[calc(100vh-16rem)] max-h-[calc(100vh-24rem)]">
          <div className="space-y-4">

            { firstProvider.chat?.status === "submitted" ? (
              <div className='mb-4'>
                <TextShimmerLoader size="sm" className="high-contrast" />
              </div>
            ) : firstProvider.chat?.messages && firstProvider.chat.messages.length > 0 ? (
              <div className="divide-y">
                {firstProvider.chat.messages.map((message: any) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            ):(
              <p className="text-muted-foreground">No response yet</p>
            )}
          
            {firstProvider.chat?.sources && firstProvider.chat.sources.length > 0 && (
              <SourcesList sources={firstProvider.chat.sources} />
            )}

            {(firstProvider.id === "gemini" || firstProvider.id === "anthropic") &&
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
        </CardContent>
      </Card>

      <Card className={`h-full flex flex-col ${!secondProvider.isActive ? "opacity-50" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{secondProvider.name}</CardTitle>
              <LikeButton initialCount={Math.floor(Math.random() * 200) + 100} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="second-provider-active"
                checked={secondProvider.isActive}
                onCheckedChange={secondProvider.toggleActive}
                disabled={secondProvider.chat?.status === "streaming" || secondProvider.chat?.status === "submitted"}
              />
              <Label htmlFor="second-provider-active">Active</Label>
            </div>
          </div>
          <ModelSelector providerId={secondProvider.id} />
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto h-[calc(100vh-16rem)] max-h-[calc(100vh-24rem)]">
          <div className="space-y-4">

           { secondProvider.chat?.status === "submitted" ? (
              <div className='mb-4'>
                <TextShimmerLoader size="sm" className="high-contrast" />
              </div>
            ) : secondProvider.chat?.messages && secondProvider.chat.messages.length > 0 ? (
              <div className="divide-y">
                {secondProvider.chat.messages.map((message: any) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            ):(
              <p className="text-muted-foreground">No response yet</p>
            )}

            {secondProvider.chat?.sources && secondProvider.chat.sources.length > 0 && (
              <SourcesList sources={secondProvider.chat.sources} />
            )}

            {(secondProvider.id === "gemini" || secondProvider.id === "anthropic") &&
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
        </CardContent>
      </Card>
    </div>
  )
}
