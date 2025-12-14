import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Brain, Plus, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get quick stats
  const { count: totalContents } = await supabase
    .from("contents")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: dueCards } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("next_due", new Date().toISOString())

  // Get recent contents
  const { data: recentContents } = await supabase
    .from("contents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.display_name || "Student"}!</h1>
        <p className="text-muted-foreground">Ready to continue your learning journey?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <Link href="/study">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Study Now</CardTitle>
                <Brain className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>{dueCards || 0} cards due</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Session</Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-primary transition-colors cursor-pointer">
          <Link href="/import">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Import Content</CardTitle>
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Add new material</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Import
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-primary transition-colors cursor-pointer">
          <Link href="/progress">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>View Progress</CardTitle>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Track your stats</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                See Stats
              </Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Contents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Your latest study materials</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/import">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentContents && recentContents.length > 0 ? (
            <div className="space-y-3">
              {recentContents.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{content.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">{content.source_type}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(content.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No content yet. Import your first study material!</p>
              <Button asChild>
                <Link href="/import">Get Started</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
