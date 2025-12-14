"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { CardWithLesson } from "@/lib/types"
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react"

interface QuizCardProps {
  card: CardWithLesson
  onComplete: (cardId: string) => void
  onSkip: () => void
}

export default function QuizCard({ card, onComplete, onSkip }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [shortAnswer, setShortAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = async () => {
    let correct = false

    if (card.card_type === "mcq") {
      const answerIndex = parseInt(selectedAnswer)
      // Handle both string and number answer types
      const correctAnswer = typeof card.answer === 'number' 
        ? card.answer 
        : parseInt(String(card.answer))
      correct = answerIndex === correctAnswer
    } else {
      // For short answer, check if answer is not empty
      // In production, you might want more sophisticated checking
      const userAnswer = shortAnswer.trim().toLowerCase()
      const correctAnswer = String(card.answer).toLowerCase()
      
      // Basic similarity check - accept if contains key terms
      correct = userAnswer.length > 0 && (
        userAnswer === correctAnswer ||
        userAnswer.includes(correctAnswer) ||
        correctAnswer.includes(userAnswer)
      )
    }

    setIsCorrect(correct)
    setShowFeedback(true)

    // Submit review to API
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: card.id,
          correct,
          confidence: "medium",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Review submission failed:", error)
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  const handleNext = () => {
    onComplete(card.id)
    setShowFeedback(false)
    setSelectedAnswer("")
    setShortAnswer("")
  }

  const canSubmit = card.card_type === "mcq" ? selectedAnswer !== "" : shortAnswer.trim().length > 0

  // Parse correct answer for display
  const correctAnswerIndex = card.card_type === "mcq"
    ? (typeof card.answer === 'number' ? card.answer : parseInt(String(card.answer)))
    : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-balance">{card.prompt}</CardTitle>
          <div className="text-xs text-muted-foreground uppercase bg-muted px-2 py-1 rounded">
            {card.card_type === "mcq" ? "Multiple Choice" : "Short Answer"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {card.card_type === "mcq" && card.choices ? (
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showFeedback}>
            <div className="space-y-3">
              {card.choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={String(index)} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className={`flex-1 cursor-pointer ${
                      showFeedback && index === correctAnswerIndex 
                        ? "font-medium text-green-600 dark:text-green-400" 
                        : ""
                    }`}
                  >
                    {choice}
                  </Label>
                  {showFeedback && index === correctAnswerIndex && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {showFeedback && parseInt(selectedAnswer) === index && index !== correctAnswerIndex && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>
        ) : (
          <div className="space-y-2">
            <Input
              placeholder="Type your answer..."
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              disabled={showFeedback}
              className="text-base"
            />
            {showFeedback && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium mb-1">Expected answer:</p>
                <p className="text-sm text-muted-foreground">{String(card.answer)}</p>
              </div>
            )}
          </div>
        )}

        {showFeedback && (
          <div
            className={`rounded-lg p-4 ${
              isCorrect
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-800 dark:text-green-200">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-medium text-red-800 dark:text-red-200">Not quite right</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isCorrect ? "Great job! This card will be scheduled for review later." : "Keep practicing!"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {!showFeedback ? (
          <>
            <Button onClick={handleSubmit} disabled={!canSubmit} className="flex-1">
              Submit Answer
            </Button>
            <Button onClick={onSkip} variant="outline">
              Skip
            </Button>
          </>
        ) : (
          <Button onClick={handleNext} className="flex-1">
            Next Card
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}