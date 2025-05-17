import { openai } from "@ai-sdk/openai"
import { createDataStreamResponse, streamText } from "ai"
import type { NextRequest } from "next/server"
import { OPENAI_SYSTEM_PROMPT } from "@/lib/system-prompt"
import type { ModelMessage } from "@/lib/types"

export const runtime = "nodejs"

function validateMessages(messages: any[]): ModelMessage[] {
  return messages
    .filter((message) => {
      const isValid =
        message &&
        typeof message === "object" &&
        (message.role === "user" || message.role === "assistant" || message.role === "system") &&
        typeof message.content === "string"

      if (!isValid) {
        console.warn("Invalid message format detected and filtered out:", message)
      }

      return isValid
    })
    .map((message) => ({
      role: message.role,
      content: message.content,
      ...(message.id && { id: message.id }),
      ...(message.name && { name: message.name }),
    }))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body || !Array.isArray(body.messages)) {
      return new Response(JSON.stringify({ error: "Invalid request body. Expected messages array." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    let selectedModel = "gpt-4.1-mini"

    if (body.model && typeof body.model === "string") {
      selectedModel = body.model
    } else {
      const modelCookie = req.cookies.get("selectedOpenAIModel")
      if (modelCookie) {
        selectedModel = modelCookie.value
      }
    }

    const validatedMessages = validateMessages(body.messages)

    return createDataStreamResponse({
      execute: async (dataStream) => {
        console.log("Starting OpenAI stream execution with model:", selectedModel)

        const result = streamText({
          model: openai(selectedModel),
          messages: validatedMessages,
          system: OPENAI_SYSTEM_PROMPT,
          temperature: 0.4,
          maxTokens: 4000,
          tools: {
            web_search_preview: openai.tools.webSearchPreview({
              searchContextSize: "high",
            }),
          },
          // toolChoice: { type: 'tool', toolName: 'web_search_preview' },
         maxSteps: 5,
          onChunk: ({ chunk }) => {
            if (chunk.type === "text-delta") {
              dataStream.writeData({ type: "text-delta", text: chunk.textDelta })
            }
          },
          onFinish: ({ text, sources , usage }) => {
            //console.log("OpenAI sources:", sources)
            if (sources && sources.length > 0) {
              const formattedSources = sources
                .filter((source) => source.sourceType === "url")
                .map((source) => ({
                  url: source.url,
                  title: source.title || new URL(source.url).hostname,
                }))

              if (formattedSources.length > 0) {
                //console.log("OpenAI formattedSources:", formattedSources)
                dataStream.writeData({ type: "sources", sources: formattedSources })
              }
            }
            if (usage) {
              dataStream.writeData({
                type: "usage",
                usage: {
                  prompt_tokens: usage.promptTokens,
                  completion_tokens: usage.completionTokens,
                  total_tokens: usage.totalTokens,
                },
              })
            }
          },
        })

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
