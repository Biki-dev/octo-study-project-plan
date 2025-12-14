import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Brain, Timer, TrendingUp, Sparkles, Zap, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Mesh */}
      <section className="relative overflow-hidden gradient-mesh">
        <div className="container max-w-6xl mx-auto px-4 py-32 text-center relative z-10">
          <div className="mb-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Learning Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Master Any Subject
              <br />
              <span className="text-gradient">10x Faster</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your notes into AI-generated micro-lessons. 
              Retain more with spaced repetition. Study smarter, not harder.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-2xl">
              <Link href="/auth/sign-up">
                <Zap className="mr-2 h-5 w-5" />
                Start Learning Free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl glass-effect">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="space-y-1">
              <div className="text-4xl font-bold text-gradient">10x</div>
              <div className="text-sm text-muted-foreground">Faster Learning</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold text-gradient">95%</div>
              <div className="text-sm text-muted-foreground">Retention Rate</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold text-gradient">24/7</div>
              <div className="text-sm text-muted-foreground">AI Assistant</div>
            </div>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50" />
      </section>

      {/* Features Grid - Asymmetric Layout */}
      <section className="container max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <br />
            <span className="text-gradient">Ace Your Studies</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Large Feature Card */}
          <Card className="lg:col-span-2 lg:row-span-2 hover:scale-[1.02] transition-transform duration-300 cursor-pointer card-gradient">
            <CardContent className="pt-8 h-full flex flex-col">
              <div className="mb-6 inline-flex p-4 bg-primary/10 rounded-2xl w-fit">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-4">AI-Generated Micro-Lessons</h3>
              <p className="text-lg text-muted-foreground mb-6 flex-1">
                Our advanced AI analyzes your content and breaks it down into bite-sized, 
                easy-to-digest lessons. Each lesson is crafted to maximize understanding 
                and retention with smart summarization and key concept extraction.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  3 lessons per content
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  Auto-generated quizzes
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  Smart explanations
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Small Feature Cards */}
          <Card className="hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex p-3 bg-accent/10 rounded-xl w-fit">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Active Recall</h3>
              <p className="text-muted-foreground">
                Test yourself with MCQs and short answer questions designed to strengthen memory.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-xl w-fit">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Spaced Repetition</h3>
              <p className="text-muted-foreground">
                Scientific SM-2 algorithm schedules reviews at optimal intervals for maximum retention.
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
            <CardContent className="pt-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-xl w-fit">
                  <Timer className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pomodoro Focus Timer</h3>
                <p className="text-muted-foreground">
                  Built-in 25-minute focus sessions keep you productive and prevent burnout with scheduled breaks.
                </p>
              </div>
              <div className="flex-1">
                <div className="mb-4 inline-flex p-3 bg-chart-4/10 rounded-xl w-fit">
                  <TrendingUp className="h-6 w-6 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Analytics</h3>
                <p className="text-muted-foreground">
                  Track accuracy, streaks, and learning trends with beautiful visualizations and insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Started in <span className="text-gradient">3 Simple Steps</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Import Content",
              description: "Paste text, add URLs, or upload PDFs. We accept any study material you have.",
              icon: "📚"
            },
            {
              step: "02",
              title: "AI Generates Lessons",
              description: "Watch as AI transforms your content into structured micro-lessons and quiz questions.",
              icon: "✨"
            },
            {
              step: "03",
              title: "Study & Master",
              description: "Review cards as they become due. Our algorithm optimizes your learning schedule.",
              icon: "🎯"
            }
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="text-6xl mb-4 opacity-20 font-bold">{item.step}</div>
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
              
              {i < 2 && (
                <div className="hidden md:block absolute top-1/4 -right-4 text-primary text-4xl">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section with Glass Effect */}
      <section className="container max-w-4xl mx-auto px-4 py-24">
        <Card className="glass-effect overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <CardContent className="pt-12 pb-12 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who are mastering their subjects faster with AI-powered 
              study tools and scientifically-proven spaced repetition.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-2xl">
              <Link href="/auth/sign-up">
                <Zap className="mr-2 h-5 w-5" />
                Start Learning for Free
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Get started in 30 seconds
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}