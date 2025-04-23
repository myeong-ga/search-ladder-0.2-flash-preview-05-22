export type Source = {
  url: string
  title: string
}

export interface Message {
  id: string
  role: "user" | "assistant" | "data" | "system"
  content: string
}
