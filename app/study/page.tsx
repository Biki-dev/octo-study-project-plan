import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import StudySession from "@/components/study-session"

export default async function StudyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch due cards with lesson information
  const { data: dueCards } = await supabase
    .from("cards")
    .select(
      `
      *,
      lesson:lessons(*)
    `,
    )
    .eq("user_id", user.id)
    .lte("next_due", new Date().toISOString())
    .order("next_due", { ascending: true })
    .limit(20)

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <StudySession initialCards={dueCards || []} />
    </div>
  )
}
