"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

const WORK_TIME = 25 * 60 // 25 minutes in seconds
const BREAK_TIME = 5 * 60 // 5 minutes in seconds

export default function PomodoroTimer() {
  const [seconds, setSeconds] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1)
      }, 1000)
    } else if (seconds === 0) {
      // Timer finished
      setIsRunning(false)
      // Auto-switch between work and break
      if (!isBreak) {
        setIsBreak(true)
        setSeconds(BREAK_TIME)
      } else {
        setIsBreak(false)
        setSeconds(WORK_TIME)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, seconds, isBreak])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setSeconds(isBreak ? BREAK_TIME : WORK_TIME)
  }

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const progressPercentage = isBreak
    ? ((BREAK_TIME - seconds) / BREAK_TIME) * 100
    : ((WORK_TIME - seconds) / WORK_TIME) * 100

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-2 w-2 rounded-full ${isBreak ? "bg-green-500" : "bg-blue-500"}`} />
              <span className="text-sm font-medium">{isBreak ? "Break Time" : "Focus Time"}</span>
            </div>
            <div className="text-4xl font-bold font-mono tabular-nums">{formatTime(seconds)}</div>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${isBreak ? "bg-green-500" : "bg-blue-500"}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2 ml-6">
            <Button onClick={toggleTimer} size="icon" variant={isRunning ? "secondary" : "default"}>
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={resetTimer} size="icon" variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
