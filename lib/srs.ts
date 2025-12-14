// Spaced Repetition System (SRS) - Simplified SM-2 Algorithm

export interface SRSCard {
  ef: number // easiness factor
  interval: number // days
  reps: number // repetitions
  next_due: string // ISO date string
}

export interface ReviewResult {
  quality: number // 0-4 (0=complete fail, 4=perfect)
}

/**
 * Updates SRS values based on review quality
 * SM-2 Algorithm implementation
 *
 * @param card Current card SRS state
 * @param review Review result with quality rating
 * @returns Updated card SRS state
 */
export function updateSRS(card: SRSCard, review: ReviewResult): SRSCard {
  const { quality } = review

  // Quality must be 0-4
  if (quality < 0 || quality > 4) {
    throw new Error("Quality must be between 0 and 4")
  }

  let { ef, interval, reps } = card

  // If quality < 3, reset the card
  if (quality < 3) {
    reps = 0
    interval = 1
  } else {
    reps += 1

    // Calculate new interval
    if (reps === 1) {
      interval = 1
    } else if (reps === 2) {
      interval = 6
    } else {
      interval = Math.round(interval * ef)
    }
  }

  // Update easiness factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

  // Calculate next due date
  const nextDue = new Date()
  nextDue.setDate(nextDue.getDate() + interval)

  return {
    ef,
    interval,
    reps,
    next_due: nextDue.toISOString(),
  }
}

/**
 * Determines if a card is due for review
 */
export function isCardDue(nextDue: string): boolean {
  return new Date(nextDue) <= new Date()
}

/**
 * Gets quality rating from boolean correct/incorrect
 */
export function getQualityFromCorrect(correct: boolean, confidence: "low" | "medium" | "high" = "medium"): number {
  if (!correct) return 0

  switch (confidence) {
    case "low":
      return 3
    case "medium":
      return 4
    case "high":
      return 4
    default:
      return 3
  }
}
