import { ComparisonChat } from "@/components/comparison-chat"
import { redirect } from "next/navigation"

export default function Home() {
  redirect("/dashboard")
}
// export default function Home() {

//   return (
//     <div className="container py-8">
   
//       <ComparisonChat />
//     </div>
//   )
// }