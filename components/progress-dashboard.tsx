"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, Calendar, Target, TrendingUp } from "lucide-react"
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
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
    return <div>Error loading progress data</div>
  }

  const stats = [
    {
      title: "Total Cards",
      value: data.totalCards,
      icon: Brain,
      description: "Cards in your library",
    },
    {
      title: "Due Today",
      value: data.dueToday,
      icon: Calendar,
      description: "Cards to review",
    },
    {
      title: "Accuracy",
      value: `${data.accuracy}%`,
      icon: Target,
      description: "Correct answers",
    },
    {
      title: "Streak",
      value: data.streak,
      icon: TrendingUp,
      description: "Days in a row",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Activity Chart */}
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

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Study Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Reviews</span>
            <span className="font-medium">{data.totalReviews}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Correct Answers</span>
            <span className="font-medium">{Math.round((data.accuracy / 100) * data.totalReviews)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cards Mastered</span>
            <span className="font-medium">{data.totalCards - data.dueToday}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
