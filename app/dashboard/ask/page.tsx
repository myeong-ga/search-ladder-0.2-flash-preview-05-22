import { ComparisonChat } from "@/components/comparison-chat"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiKeyWarning } from "@/components/api-key-warning"
// import { isGoogleApiKeyAvailable } from "@/lib/google-ai"
// import { isOpenAIApiKeyAvailable } from "@/lib/openai-ai"

export default function AskAIPage() {
  // Server-side check for environment variables
  // const isGoogleValid = isGoogleApiKeyAvailable()
  // const isOpenAIValid = isOpenAIApiKeyAvailable()
  // const isValid = isGoogleValid && isOpenAIValid

  return (
    <DashboardLayout>
       <div className="w-full h-full">
     
        <ComparisonChat />
      </div>
    </DashboardLayout>
  )
}
