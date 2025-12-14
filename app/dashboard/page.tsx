import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Brain, Plus, TrendingUp, Flame, Zap } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { count: totalContents } = await supabase
    .from("contents")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: dueCards } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("next_due", new Date().toISOString())

  const { data: recentContents } = await supabase
    .from("contents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Welcome Header with Gradient */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Welcome back,{" "}
            <span className="text-gradient">{profile?.display_name || "Student"}</span>!
          </h1>
          <p className="text-xl text-muted-foreground">Ready to continue your learning journey?</p>
        </div>

        {/* Stats Overview - Horizontal Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="glass-effect hover:scale-[1.02] transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cards Due Today</p>
                  <h3 className="text-4xl font-bold text-gradient">{dueCards || 0}</h3>
                </div>
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Flame className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${Math.min((dueCards || 0) * 10, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:scale-[1.02] transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Study Materials</p>
                  <h3 className="text-4xl font-bold text-gradient">{totalContents || 0}</h3>
                </div>
                <div className="p-3 bg-chart-3/10 rounded-2xl">
                  <BookOpen className="h-6 w-6 text-chart-3" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Total imported content</p>
            </CardContent>
          </Card>

          <Card className="glass-effect hover:scale-[1.02] transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Learning Streak</p>
                  <h3 className="text-4xl font-bold text-gradient">0d</h3>
                </div>
                <div className="p-3 bg-chart-4/10 rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-chart-4" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Keep it going!</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Large Action Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Link href="/study" className="group">
            <Card className="card-gradient hover:scale-[1.02] transition-all duration-300 h-full border-2 border-primary/20">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="inline-flex p-6 bg-primary/10 rounded-3xl mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Study Now</h3>
                <p className="text-muted-foreground mb-6">{dueCards || 0} cards waiting</p>
                <Button className="w-full rounded-xl" size="lg">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Session
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/import" className="group">
            <Card className="hover:scale-[1.02] transition-all duration-300 h-full border-2 border-transparent hover:border-primary/20">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="inline-flex p-6 bg-accent/10 rounded-3xl mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Import Content</h3>
                <p className="text-muted-foreground mb-6">Add new material</p>
                <Button variant="outline" className="w-full rounded-xl bg-transparent" size="lg">
                  Import
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/progress" className="group">
            <Card className="hover:scale-[1.02] transition-all duration-300 h-full border-2 border-transparent hover:border-primary/20">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="inline-flex p-6 bg-chart-4/10 rounded-3xl mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-10 w-10 text-chart-4" />
                </div>
                <h3 className="text-2xl font-bold mb-2">View Progress</h3>
                <p className="text-muted-foreground mb-6">Track your stats</p>
                <Button variant="outline" className="w-full rounded-xl bg-transparent" size="lg">
                  See Stats
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Contents with Modern Design */}
        <Card className="glass-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Recent Content</CardTitle>
                <CardDescription className="text-base mt-1">Your latest study materials</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="rounded-xl">
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
                    className="group flex items-center justify-between p-4 rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{content.title}</p>
                        <p className="text-sm text-muted-foreground capitalize">{content.source_type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(content.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex p-6 bg-muted rounded-3xl mb-6">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-xl font-semibold mb-2">No content yet</p>
                <p className="text-muted-foreground mb-6">Import your first study material to get started!</p>
                <Button asChild size="lg" className="rounded-xl">
                  <Link href="/import">
                    <Plus className="mr-2 h-5 w-5" />
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}