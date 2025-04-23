import { google } from "@ai-sdk/google"
import { createDataStreamResponse, streamText } from "ai"
import type { NextRequest } from "next/server"
import { GOOGLE_SEARCH_SUGGESTIONS_PROMPT } from "@/lib/system-prompt"

// Updated interface to match Google Gemini API structure
interface GoogleGroundingMetadata {
  searchEntryPoint?: {
    renderedContent: string
  }
  groundingChunks?: Array<{
    web?: {
      uri: string
      title: string
    }
  }>
  groundingSupports?: Array<{
    segment: {
      startIndex?: number
      endIndex: number
      text: string
    }
    groundingChunkIndices: number[]
    confidenceScores: number[]
  }>
  webSearchQueries?: string[]
}

interface GoogleProviderMetadata {
  google?: {
    groundingMetadata?: GoogleGroundingMetadata
    safetyRatings?: any
  }
}

// Helper function to extract search suggestions from text
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

// Function to remove SEARCH_TERMS_JSON blocks from text
function removeSearchTermsJson(text: string): string {
  const pattern = /```SEARCH_TERMS_JSON\s*({[\s\S]*?})\s*```/g
  return text.replace(pattern, "").trim()
}

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Use createDataStreamResponse which is designed for this exact use case
    return createDataStreamResponse({
      execute: async (dataStream) => {
        // Log that we're starting
        console.log("Starting Google stream execution")

        // Buffer to collect the full text
        let fullText = ""

        // Create a stream using the Google Gemini model with search grounding
        const result = await streamText({
          model: google("gemini-2.5-flash-preview-04-17", {
            useSearchGrounding: true,
          }),
          messages,
          // Add system prompt with search suggestions instructions
          system: GOOGLE_SEARCH_SUGGESTIONS_PROMPT,
          temperature: 0.8,
          maxTokens: 10000,
          // 1. Text streaming in onChunk handler
          onChunk: ({ chunk }) => {
            // Stream text chunks in real-time to the client
            if (chunk.type === "text-delta") {
              // Add to our buffer
              fullText += chunk.textDelta

              // Stream the raw chunk immediately for real-time display
              dataStream.writeData({
                type: "text-delta",
                text: chunk.textDelta,
              })
            }
          },
          // 2. Sources and search suggestions processing in onFinish handler
          onFinish: ({ text, providerMetadata }) => {
            console.log("Google onFinish called")

            try {
              const metadata = providerMetadata as unknown as GoogleProviderMetadata

              // Process sources
              if (metadata?.google?.groundingMetadata) {
                // Extract sources from groundingChunks
                const sources: { url: string; title: string }[] = []
                if (metadata.google.groundingMetadata.groundingChunks) {
                  metadata.google.groundingMetadata.groundingChunks.forEach((chunk) => {
                    if (chunk.web && chunk.web.uri) {
                      sources.push({
                        url: chunk.web.uri,
                        title: chunk.web.title || new URL(chunk.web.uri).hostname,
                      })
                    }
                  })
                }

                // Send the processed sources directly
                if (sources.length > 0) {
                  dataStream.writeData({ type: "sources", sources })
                }
              }

              // Extract search suggestions from the response text
              const searchSuggestions = extractSearchSuggestionsFromText(fullText)
              if (searchSuggestions) {
                dataStream.writeData({
                  type: "searchSuggestions",
                  searchSuggestions: searchSuggestions.searchTerms,
                  confidence: searchSuggestions.confidence,
                  reasoning: searchSuggestions.reasoning,
                })
              }

              // Send the cleaned text as a special message type
              const cleanedText = removeSearchTermsJson(fullText)
              dataStream.writeData({
                type: "cleaned-text",
                text: cleanedText,
                messageId: Date.now().toString(), // Use a timestamp as a simple ID
              })
            } catch (error) {
              console.error("Error processing metadata in onFinish:", error)
            }
          },
        })

        // Merge the text stream into our data stream
        result.mergeIntoDataStream(dataStream)
      },
      onError: (error) => {
        console.error("Error in Google stream:", error)
        return error instanceof Error ? error.message : String(error)
      },
    })
  } catch (error) {
    console.error("Error in Google chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to process Google chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
