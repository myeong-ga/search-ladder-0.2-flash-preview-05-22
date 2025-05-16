"use client"
import type { Message } from "@/lib/types"
import { User, Bot } from "lucide-react"
import { MarkdownText } from "./markdown-text"
import { TextShimmerLoader } from "./TextShimmerLoader"

export interface ChatMessageSingleProps {
  message: Message
  status?: "submitted" | "streaming" | "ready" | "error"
  isLast?: boolean
}

export function ChatMessageSingle({ message, status, isLast }: ChatMessageSingleProps) {
  return (
    <div className="w-full">
      {status === "submitted" && isLast && message.role === "user" ? (
        <div className="flex flex-col gap-2 w-full  p-2 mt-2">
          <div className="flex gap-6 items-start">
            <div className="flex h-8 w-8 items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 w-full max-w-[80%]">{message.content}</div>
          </div>
          <div className="flex h-8 w-full p-2 pl-12 items-start">
            <TextShimmerLoader size="md" className="high-contrast" />
          </div>
        </div>
      ) : (
        <div className="flex gap-6 p-2 mt-2 items-start">
          <div className="flex h-8 w-8 items-center justify-center">
            {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>
          {message.role === "assistant" ? (
            <div className="flex-1 w-full max-w-[80%] font-mono">
              <MarkdownText>{message.content}</MarkdownText>
            </div>
          ) : (
            <div className="flex-1 w-full max-w-[80%]">{message.content}</div>
          )}
        </div>
      )}
    </div>
  )
}
