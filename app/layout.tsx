import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import { ThemeProvider } from "@/components/theme-provider"
import { LlmProviderContextProvider } from "@/contexts/llm-provider-context"
import { Toaster } from "sonner"
import { CustomToaster } from "@/components/custom-toaster"


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
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <link href="//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css" rel="stylesheet" type="text/css" />
      </head>
      <body className={GeistSans.className}  suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LlmProviderContextProvider>
            <div className="min-h-screen flex flex-col">
              <header className="border-b">
               
              </header>
              <main className="flex-1">{children}</main>
            </div>
            <CustomToaster />
          </LlmProviderContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
