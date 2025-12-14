"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import PomodoroTimer from "@/components/pomodoro-timer"
import QuizCard from "@/components/quiz-card"
import type { CardWithLesson } from "@/lib/types"
import { BookOpen, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface StudySessionProps {
  initialCards: CardWithLesson[]
}

export default function StudySession({ initialCards }: StudySessionProps) {
  const [cards] = useState<CardWithLesson[]>(initialCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedCards, setCompletedCards] = useState<string[]>([])

  const currentCard = cards[currentIndex]
  const totalCards = cards.length
  const completedCount = completedCards.length
  const progress = totalCards > 0 ? (completedCount / totalCards) * 100 : 0

  const handleCardComplete = (cardId: string) => {
    const newCompletedCards = [...completedCards, cardId]
    setCompletedCards(newCompletedCards)

    // Move to next card only if there are more cards
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleSkip = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle>All caught up!</CardTitle>
          <CardDescription>You have no cards due for review right now</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Great job staying on top of your studies. Import more content or check back later for your next review
            session.
          </p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/import">Import Content</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Check if session is complete
  if (completedCount === totalCards) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle>Session Complete!</CardTitle>
          <CardDescription>You reviewed {completedCount} cards</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground text-center">Excellent work! Keep up the consistency.</p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/progress">View Progress</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Study Session</h1>
          <div className="text-sm text-muted-foreground">
            {completedCount} / {totalCards} completed
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Pomodoro Timer */}
      <PomodoroTimer />

      {/* Current Card */}
      {currentCard && (
        <div className="space-y-4">
          {/* Lesson Context */}
          <Card className="bg-muted/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">{currentCard.lesson.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{currentCard.lesson.explanation}</p>
            </CardContent>
          </Card>

          {/* Quiz Card */}
          <QuizCard card={currentCard} onComplete={handleCardComplete} onSkip={handleSkip} />
        </div>
      )}
    </div>
  )
}