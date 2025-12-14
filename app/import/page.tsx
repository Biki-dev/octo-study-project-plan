import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ImportForm from "@/components/import-form"

export default async function ImportPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Import Content</h1>
        <p className="text-muted-foreground">Add your study materials to generate personalized lessons and quizzes</p>
      </div>
      <ImportForm />
    </div>
  )
}
