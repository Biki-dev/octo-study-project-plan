import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import GenerateLessons from "@/components/generate-lessons"

interface PageProps {
  params: Promise<{
    contentId: string
  }>
}

export default async function GeneratePage({ params }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { contentId } = await params

  // Fetch the content
  const { data: content, error } = await supabase
    .from("contents")
    .select("*")
    .eq("id", contentId)
    .eq("user_id", user.id)
    .single()

  if (error || !content) {
    redirect("/dashboard")
  }

  // Check if lessons already exist
  const { data: existingLessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("content_id", contentId)
    .eq("user_id", user.id)

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <GenerateLessons content={content} hasExistingLessons={existingLessons && existingLessons.length > 0} />
    </div>
  )
}
