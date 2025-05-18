import { openai } from "@ai-sdk/openai"
import { createDataStreamResponse, JSONValue, streamText } from "ai"
import type { NextRequest } from "next/server"
import { OPENAI_SEARCH_SUGGESTIONS_PROMPT } from "@/lib/system-prompt"
import type { ModelMessage, ModelConfig } from "@/lib/types"
import { DEFAULT_MODEL_CONFIG } from "@/lib/models"

export const runtime = "nodejs"
function extractSearchSuggestionsFromText(
  text: string,
): { searchTerms: string[]; confidence: number; reasoning: string } | null {
  try {
    const regex = /```SEARCH_TERMS_JSON\s*({[\s\S]*?})\s*```/
    const match = text.match(regex)

    if (match && match[1]) {
      const jsonStr = match[1].trim()
      const searchSuggestions = JSON.parse(jsonStr)

      if (
        searchSuggestions &&
        Array.isArray(searchSuggestions.searchTerms) &&
        typeof searchSuggestions.confidence === "number" &&
        typeof searchSuggestions.reasoning === "string"
      ) {
        return {
          searchTerms: searchSuggestions.searchTerms,
          confidence: searchSuggestions.confidence,
          reasoning: searchSuggestions.reasoning,
        }
      }
    }
    return null
  } catch (error) {
    console.error("Error extracting search suggestions:", error)
    return null
  }
}
function removeSearchTermsJson(text: string): string {
  const pattern = /```SEARCH_TERMS_JSON\s*({[\s\S]*?})\s*```/g
  return text.replace(pattern, "").trim()
}
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

    // Get model configuration
    const modelConfig: ModelConfig = body.modelConfig || DEFAULT_MODEL_CONFIG

    const validatedMessages = validateMessages(body.messages)

    return createDataStreamResponse({
      execute: async (dataStream) => {
        console.log("Starting OpenAI stream execution with model:", selectedModel)

        let fullText = ""
        const result = streamText({
          model: openai.responses(selectedModel),
          messages: validatedMessages,
          system: OPENAI_SEARCH_SUGGESTIONS_PROMPT,
          temperature: modelConfig.temperature,
          topP: modelConfig.topP,
          maxTokens: modelConfig.maxTokens,
          providerOptions: {
            openai: {
              reasoningSummary: "auto", // 'auto' for condensed or 'detailed' for comprehensive
            },
          },
          tools: {
            web_search_preview: openai.tools.webSearchPreview({
              searchContextSize: "medium",
            }),
          },
          toolChoice: { type: "tool", toolName: "web_search_preview" },
          maxSteps: 5,
          onChunk: ({ chunk }) => {
            if (chunk.type === "text-delta") {
              fullText += chunk.textDelta
              dataStream.writeData({ type: "text-delta", text: chunk.textDelta })
            }
          },
          onFinish: ({ reasoning, sources, usage, finishReason }) => {
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
            const searchSuggestions = extractSearchSuggestionsFromText(fullText)
            if (searchSuggestions) {
              dataStream.writeData({
                type: "searchSuggestions",
                searchSuggestions: searchSuggestions.searchTerms,
                confidence: searchSuggestions.confidence,
                reasoning: searchSuggestions.reasoning,
              })
            }
            const cleanedText = removeSearchTermsJson(fullText)
            dataStream.writeData({
              type: "cleaned-text",
              text: cleanedText,
              messageId: Date.now().toString(),
            })

            if (usage) {
              dataStream.writeData({
                type: "usage",
                usage: {
                  prompt_tokens: usage.promptTokens,
                  completion_tokens: usage.completionTokens,
                  total_tokens: usage.totalTokens,
                  finishReason: finishReason || "unknown",
                },
              })
            }
            if (reasoning) {
              console.log("OpenAI reasoning:", reasoning)
            }
            dataStream.writeData({
              type: "model-config",
              config: modelConfig,
            } as unknown as JSONValue)
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
