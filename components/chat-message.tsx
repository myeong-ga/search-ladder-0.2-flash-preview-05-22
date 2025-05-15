"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"
import { User, Bot } from "lucide-react"


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

export function ChatMessage({ message }: ChatMessageProps) {


  return (
    <div className={cn("flex gap-1 p-1")}>
      <div className="flex h-4 w-4 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        {message.role === "user" ? <User className="h-2 w-2" /> : <Bot className="h-2 w-2" />}
      </div>
      <div className="flex-1 text-sm">
     
         <div
              className={`rounded-sm px-3 py-2 max-w-[80%]  font-mono font-normal`}
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
    </div>
  )
}
