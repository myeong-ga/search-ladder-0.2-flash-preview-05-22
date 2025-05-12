import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LlmProviderContextProvider } from "@/contexts/llm-provider-context"


// Use JetBrains Mono as an alternative monospace font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: 'swap'
})

export const metadata: Metadata = {
  title: "AI Search Model Comparison",
  description: "Compare search results from Google Gemini and OpenAI side by side",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-mono`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LlmProviderContextProvider>
          {children}
          </LlmProviderContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
