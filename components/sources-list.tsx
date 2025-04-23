import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Source } from "@/lib/types"

interface SourcesListProps {
  sources: Source[]
}

export function SourcesList({ sources }: SourcesListProps) {
  if (!sources.length) return null

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Sources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sources.map((source, index) => (
          <div key={index} className="text-sm font-mono">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 hover:underline text-blue-600 dark:text-blue-400"
            >
              <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">{source.title || new URL(source.url).hostname}</div>
              </div>
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
