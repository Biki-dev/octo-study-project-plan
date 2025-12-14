"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react"
import type { Content } from "@/lib/types"

interface GenerateLessonsProps {
  content: Content
  hasExistingLessons: boolean
}

export default function GenerateLessons({ content, hasExistingLessons }: GenerateLessonsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ lessonsCreated: number; cardsCreated: number } | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId: content.id }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate lessons")
      }

      const data = await response.json()
      setResult({
        lessonsCreated: data.lessonsCreated,
        cardsCreated: data.cardsCreated,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  if (result) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <CardTitle>Lessons Generated Successfully</CardTitle>
          </div>
          <CardDescription>Your personalized study materials are ready</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="text-2xl font-bold">{result.lessonsCreated}</div>
              <div className="text-sm text-muted-foreground">Micro-lessons created</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-2xl font-bold">{result.cardsCreated}</div>
              <div className="text-sm text-muted-foreground">Quiz cards generated</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/study")} className="flex-1">
              Start Studying
            </Button>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="flex-1">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate AI Lessons</CardTitle>
        <CardDescription>Transform your content into personalized micro-lessons and quizzes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Content:</span>
            <span className="text-muted-foreground">{content.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Source:</span>
            <span className="text-muted-foreground capitalize">{content.source_type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Length:</span>
            <span className="text-muted-foreground">{content.raw_text.length} characters</span>
          </div>
        </div>

        {hasExistingLessons && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This content already has lessons. Generating again will create additional lessons.
            </p>
          </div>
        )}

        <div className="bg-muted rounded-lg p-4 space-y-2">
          <h4 className="font-medium">What will be generated:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
            <li>3 micro-lessons with key facts and explanations</li>
            <li>9 quiz questions (6 multiple choice + 3 short answer)</li>
            <li>Spaced repetition scheduling for each question</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating lessons with AI...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Lessons
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
