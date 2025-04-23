import { openai } from "@ai-sdk/openai"
import { createDataStreamResponse, streamText } from "ai"
import type { NextRequest } from "next/server"
import { OPENAI_SYSTEM_PROMPT  } from "@/lib/system-prompt"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Use createDataStreamResponse which is designed for this exact use case
    return createDataStreamResponse({
      execute: async (dataStream) => {
        // Log that we're starting
        console.log("Starting OpenAI stream execution")

        // Create a stream using the OpenAI model with web search
        const result = await streamText({
          model: openai.responses("gpt-4.1-mini"),
          messages,
          // Add system prompt
          system: OPENAI_SYSTEM_PROMPT ,
          temperature: 0.8,
          maxTokens: 10000,
          tools: {
            web_search_preview: openai.tools.webSearchPreview({
              searchContextSize: "medium",
            }),
          },
          // Force web search tool
          toolChoice: { type: "tool", toolName: "web_search_preview" },
          // 1. Text streaming in onChunk handler
          onChunk: ({ chunk }) => {
            // Stream text chunks in real-time to the client
            if (chunk.type === "text-delta") {
              dataStream.writeData({ type: "text-delta", text: chunk.textDelta })
            }
          },
          // 2. Sources processing in onFinish handler
          onFinish: ({ text, sources }) => {
            console.log("OpenAI onFinish called")

            // Process and send sources
            if (sources && sources.length > 0) {
              const formattedSources = sources
                .filter((source) => source.sourceType === "url")
                .map((source) => ({
                  url: source.url,
                  title: source.title || new URL(source.url).hostname,
                }))

              if (formattedSources.length > 0) {
                dataStream.writeData({ type: "sources", sources: formattedSources })
              }
            }
          },
        })

        // Merge the text stream into our data stream
        result.mergeIntoDataStream(dataStream)
      },
      onError: (error) => {
        console.error("Error in OpenAI stream:", error)
        return error instanceof Error ? error.message : String(error)
      },
    })
  } catch (error) {
    console.error("Error in OpenAI chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to process OpenAI chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
