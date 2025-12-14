import { createClient } from "@/lib/supabase/server"
import { updateSRS, getQualityFromCorrect } from "@/lib/srs"
import { NextResponse } from "next/server"

interface ReviewRequest {
  cardId: string
  correct: boolean
  confidence?: "low" | "medium" | "high"
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: ReviewRequest = await request.json()
    const { cardId, correct, confidence = "medium" } = body

    if (!cardId) {
      return NextResponse.json({ error: "Card ID is required" }, { status: 400 })
    }

    // Fetch the current card
    const { data: card, error: cardError } = await supabase
      .from("cards")
      .select("*")
      .eq("id", cardId)
      .eq("user_id", user.id)
      .single()

    if (cardError || !card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    // Calculate quality from correct/incorrect and confidence
    const quality = getQualityFromCorrect(correct, confidence)

    // Update SRS values
    const updatedSRS = updateSRS(
      {
        ef: card.ef,
        interval: card.interval,
        reps: card.reps,
        next_due: card.next_due,
      },
      { quality },
    )

    // Update card in database
    const { error: updateError } = await supabase
      .from("cards")
      .update({
        ef: updatedSRS.ef,
        interval: updatedSRS.interval,
        reps: updatedSRS.reps,
        next_due: updatedSRS.next_due,
      })
      .eq("id", cardId)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Error updating card:", updateError)
      return NextResponse.json({ error: "Failed to update card" }, { status: 500 })
    }

    // Record the review
    const { error: reviewError } = await supabase.from("reviews").insert({
      card_id: cardId,
      user_id: user.id,
      quality,
    })

    if (reviewError) {
      console.error("Error recording review:", reviewError)
      // Don't fail the request if review recording fails
    }

    return NextResponse.json({
      message: "Review recorded successfully",
      nextDue: updatedSRS.next_due,
      interval: updatedSRS.interval,
    })
  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
