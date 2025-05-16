"use client"
import type { Message } from "@/lib/types"
import { User, Bot, Copy, Check } from "lucide-react"
import { TextShimmerLoader } from "./TextShimmerLoader"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { copyToClipboard } from "@/lib/copy-to-clipboard"

export interface ChatMessageProps {
  message: Message
  status?: "submitted" | "streaming" | "ready" | "error"
  isLast?: boolean
}

export function ChatMessage({ message, status, isLast }: ChatMessageProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content)
    if (success) {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  if (status === "submitted" && isLast && message.role === "user") {
    return (
      <div className="w-full">
        <div className="flex gap-6 p-2 items-start">
          <div className="flex h-5 w-5 m-1 shrink-0 select-none items-center justify-center bg-background">
            {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>
          <div
            className="px-3 py-2 max-w-[80%] font-mono"
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "12px",
              lineHeight: "18px",
              fontWeight: 400,
            }}
          >
            {message.content}
          </div>
        </div>
        <div className="flex h-8 w-full p-2 pl-8 items-start">
          <TextShimmerLoader size="md" className="high-contrast" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex gap-6 p-2 items-start">
        <div className="flex h-5 w-5 m-1 shrink-0 select-none items-center justify-center bg-background">
          {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        <div className="w-full h-full">
          <div
            className="px-3 py-2 max-w-[80%] font-mono"
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "12px",
              lineHeight: "18px",
              fontWeight: 400,
            }}
          >
            {message.content}
          </div>

          {message.role === "assistant" && status === "ready" && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopy}
                aria-label="Copy message to clipboard"
              >
                {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
