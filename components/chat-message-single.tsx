"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"
import { User, Bot } from "lucide-react"
import { MarkdownText } from "./markdown-text"


interface ChatMessageProps {
  message: Message
}

// Define a type for the code component props
interface CodeComponentProps {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
  [key: string]: any
}

export function ChatMessageSingle({ message }: ChatMessageProps) {

  return (
   <div className={cn("flex gap-3 p-4", message.role === "user" ? "bg-muted/50" : "bg-background")}>
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
       <div className="flex-1 space-y-2">
        {message.role === "assistant" ? (
         <div className=" max-w-[80%] font-mono ">
          <MarkdownText> 
            {message.content}
          </MarkdownText>
        </div>
        ) : (
           <div className=" max-w-[80%]">
            {message.content }
          </div>
        )}
      </div>
    </div>
  )
}
