"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, StopCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatMessage } from "@/components/chat-message"
import { SourcesList } from "@/components/sources-list"
import { SearchSuggestions } from "@/components/search-suggestions"
import { ModelSelector } from "@/components/model-selector"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { ProviderType, ChatInterface } from "@/lib/types"
import { useGeminiChat } from "@/hooks/use-gemini-chat"
import { useOpenAIChat } from "@/hooks/use-openai-chat"
import { useLlmProvider } from "@/contexts/llm-provider-context"

interface SingleChatProps {
  providerId: ProviderType
}

export function SingleChat({ providerId }: SingleChatProps) {
  const [input, setInput] = useState("")
  const [isActive, setIsActive] = useState(true)
  const { providers } = useLlmProvider()

  const geminiChat = useGeminiChat()
  const openaiChat = useOpenAIChat()

  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const provider = providers.find((p) => p.id === providerId)

  const getProviderChat = (id: ProviderType): ChatInterface | null => {
    switch (id) {
      case "gemini":
        return geminiChat
      case "openai":
        return openaiChat
      case "anthropic":
        return null
      default:
        return null
    }
  }

  const chat = getProviderChat(providerId)
  const isLoading = isActive && chat?.isLoading

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSearchSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const toggleActive = () => {
    setIsActive((prev) => !prev)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!input.trim() || !isActive) return

    if (chat?.sendMessage) {
      await chat.sendMessage(input)
      setInput("")
    }
  }

  const stopGenerating = () => {
    if (isActive && chat?.isLoading && chat?.stop) {
      chat.stop()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      formRef.current?.requestSubmit()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] mx-auto">
      <div className="flex-1">
        <Card className={`h-full flex flex-col ${!isActive ? "opacity-50" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg">{provider?.name || providerId}</CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  id="provider-active"
                  checked={isActive}
                  onCheckedChange={toggleActive}
                  disabled={chat?.isLoading}
                />
                <Label htmlFor="provider-active">Active</Label>
              </div>
            </div>
            <ModelSelector providerId={providerId} />
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto h-[calc(100vh-16rem)] max-h-[calc(100vh-24rem)]">
            <div className="space-y-4">
              {chat?.messages && chat.messages.length > 0 ? (
                <div className="divide-y">
                  {chat.messages.map((message: any) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>
              ) : chat?.isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ) : (
                <p className="text-muted-foreground">No response yet</p>
              )}
              {chat?.sources && chat.sources.length > 0 && <SourcesList sources={chat.sources} />}
              {providerId === "gemini" && chat?.searchSuggestions && chat.searchSuggestions.length > 0 && (
                <SearchSuggestions
                  suggestions={chat.searchSuggestions}
                  reasoning={chat.searchSuggestionsReasoning}
                  confidence={chat.searchSuggestionsConfidence}
                  onSuggestionClick={handleSearchSuggestionClick}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 w-full">
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-2 w-full items-center">
          <div className="relative w-full max-w-[768px] mx-auto">
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
                <Button type="submit" size="icon" disabled={!input.trim() || !isActive} className="h-8 w-8">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-right w-full max-w-[768px]">
            Press <kbd className="rounded border px-1 py-0.5 bg-muted">Ctrl</kbd> +{" "}
            <kbd className="rounded border px-1 py-0.5 bg-muted">Enter</kbd> to send
          </div>
        </form>
      </div>
    </div>
  )
}
