import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProgressDashboard from "@/components/progress-dashboard"

export default async function ProgressPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and retention</p>
      </div>
      <ProgressDashboard />
    </div>
  )
}
