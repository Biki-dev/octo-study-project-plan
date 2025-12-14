import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Brain, Timer, TrendingUp, Sparkles, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 text-balance">
            Learn Smarter with AI-Powered <span className="text-primary">Study Sessions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Transform your notes into personalized micro-lessons and quizzes. Master any subject with spaced repetition
            and focused study sessions.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Get Started Free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Generated Lessons</h3>
              <p className="text-muted-foreground">
                Import your content and let AI create concise micro-lessons with key facts and explanations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Active Recall Quizzes</h3>
              <p className="text-muted-foreground">
                Practice with auto-generated MCQs and short answer questions for effective learning.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Spaced Repetition</h3>
              <p className="text-muted-foreground">
                Scientific algorithm schedules reviews at optimal intervals to maximize retention.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-lg">
                <Timer className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pomodoro Timer</h3>
              <p className="text-muted-foreground">
                Built-in focus timer helps you maintain concentration during study sessions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your accuracy, streaks, and learning trends with detailed analytics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
              <p className="text-muted-foreground">Import from text, URLs, or PDFs to study any content you need.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-4xl mx-auto px-4 py-20 text-center">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-3xl font-bold mb-4">Ready to level up your learning?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join students who are mastering their subjects faster with AI-powered study tools and spaced repetition.
            </p>
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Start Learning Now</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
