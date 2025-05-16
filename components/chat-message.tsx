"use client"
import type { Message } from "@/lib/types"
import { User, Bot } from "lucide-react"
import { TextShimmerLoader } from "./TextShimmerLoader"

export interface ChatMessageProps {
  message: Message
  status?: "submitted" | "streaming" | "ready" | "error"
  isLast?: boolean
}

export function ChatMessage({ message, status, isLast }: ChatMessageProps) {
  return (
    <div className="w-full">
      {status === "submitted" && isLast && message.role === "user" ? (
        <>
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
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
