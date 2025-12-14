"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, Calendar, Target, TrendingUp, Flame, Award, Zap, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ProgressData {
  totalCards: number
  dueToday: number
  accuracy: number
  streak: number
  totalReviews: number
  activityData: Array<{
    date: string
    correct: number
    incorrect: number
    total: number
  }>
}

export default function ProgressDashboard() {
  const [data, setData] = useState<ProgressData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/progress")
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching progress:", err)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-effect">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="glass-effect">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Error loading progress data</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Cards",
      value: data.totalCards,
      icon: Brain,
      description: "In your library",
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: "+12% from last week"
    },
    {
      title: "Due Today",
      value: data.dueToday,
      icon: Calendar,
      description: "Ready to review",
      color: "text-accent",
      bgColor: "bg-accent/10",
      trend: "On schedule"
    },
    {
      title: "Accuracy",
      value: `${data.accuracy}%`,
      icon: Target,
      description: "Correct answers",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      trend: data.accuracy >= 80 ? "Excellent!" : "Keep going"
    },
    {
      title: "Streak",
      value: data.streak,
      icon: Flame,
      description: "Days in a row",
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
      trend: data.streak > 0 ? "Keep it up!" : "Start today"
    },
  ]

  // Calculate additional metrics
  const masteredCards = Math.max(0, data.totalCards - data.dueToday)
  const completionRate = data.totalCards > 0 ? Math.round((masteredCards / data.totalCards) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="glass-effect hover:scale-[1.02] transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                    <h3 className="text-4xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-2xl group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.bgColor} transition-all duration-500`}
                      style={{ 
                        width: stat.title === "Accuracy" ? `${data.accuracy}%` : 
                               stat.title === "Streak" ? `${Math.min(data.streak * 10, 100)}%` : "100%"
                      }}
                    />
                  </div>
                  <span className="text-muted-foreground">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Performance Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-effect hover:scale-[1.02] transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mastery Rate</p>
                <h3 className="text-3xl font-bold">{completionRate}%</h3>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mastered</span>
                <span className="font-medium">{masteredCards} cards</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:scale-[1.02] transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-chart-4/10 rounded-2xl">
                <Zap className="h-8 w-8 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <h3 className="text-3xl font-bold">{data.totalReviews}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {data.totalReviews > 0 
                ? `${Math.round((data.accuracy / 100) * data.totalReviews)} correct answers`
                : "Start reviewing to see stats"
              }
            </p>
          </CardContent>
        </Card>


      </div>

      {/* Activity Chart - Premium Design */}
     <Card>
        <CardHeader>
          <CardTitle>Review Activity (Last 30 Days)</CardTitle>
          <CardDescription>Your daily review performance</CardDescription>
        </CardHeader>
        <CardContent>
          {data.activityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.activityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="correct" fill="hsl(var(--chart-1))" name="Correct" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incorrect" fill="hsl(var(--chart-2))" name="Incorrect" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No review data yet. Start studying to see your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>


      {/* Detailed Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Study Summary */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-xl">Study Summary</CardTitle>
            <CardDescription>Your learning metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <span className="text-sm font-medium">Total Reviews</span>
              <span className="text-2xl font-bold">{data.totalReviews}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <span className="text-sm font-medium">Correct Answers</span>
              <span className="text-2xl font-bold text-primary">
                {Math.round((data.accuracy / 100) * data.totalReviews)}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <span className="text-sm font-medium">Cards Mastered</span>
              <span className="text-2xl font-bold text-chart-4">{masteredCards}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <span className="text-sm font-medium">Current Accuracy</span>
              <span className="text-2xl font-bold text-accent">{data.accuracy}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-xl">Achievements</CardTitle>
            <CardDescription>Your milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">
                  {data.streak > 0 ? `${data.streak} Day Streak` : "Start Your Streak"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {data.streak > 0 ? "Keep the momentum going!" : "Review cards daily"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="p-3 bg-accent/20 rounded-xl">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold">
                  {data.totalReviews >= 100 ? "Centurion" : "Getting Started"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {data.totalReviews >= 100 
                    ? "100+ reviews completed!" 
                    : `${100 - data.totalReviews} reviews to Centurion`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-chart-4/10 border border-chart-4/20">
              <div className="p-3 bg-chart-4/20 rounded-xl">
                <Target className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="font-semibold">
                  {data.accuracy >= 80 ? "High Achiever" : "Keep Practicing"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {data.accuracy >= 80 
                    ? "Excellent accuracy!" 
                    : "80% accuracy unlocks this"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}