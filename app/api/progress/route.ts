import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total cards
    const { count: totalCards } = await supabase
      .from("cards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Get due cards today
    const { count: dueToday } = await supabase
      .from("cards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .lte("next_due", new Date().toISOString())

    // Get total reviews
    const { data: reviews } = await supabase.from("reviews").select("*").eq("user_id", user.id)

    // Calculate accuracy
    const correctReviews = reviews?.filter((r) => r.quality >= 3).length || 0
    const accuracy = reviews && reviews.length > 0 ? Math.round((correctReviews / reviews.length) * 100) : 0

    // Calculate streak (consecutive days with reviews)
    let streak = 0
    if (reviews && reviews.length > 0) {
      const sortedReviews = reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const currentDate = new Date(today)

      for (let i = 0; i < 30; i++) {
        const hasReviewOnDate = sortedReviews.some((r) => {
          const reviewDate = new Date(r.created_at)
          reviewDate.setHours(0, 0, 0, 0)
          return reviewDate.getTime() === currentDate.getTime()
        })

        if (hasReviewOnDate) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
      }
    }

    // Get recent reviews for activity chart
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: recentReviews } = await supabase
      .from("reviews")
      .select("created_at, quality")
      .eq("user_id", user.id)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true })

    // Group reviews by date
    const reviewsByDate: Record<string, { correct: number; incorrect: number }> = {}
    recentReviews?.forEach((review) => {
      const date = new Date(review.created_at).toISOString().split("T")[0]
      if (!reviewsByDate[date]) {
        reviewsByDate[date] = { correct: 0, incorrect: 0 }
      }
      if (review.quality >= 3) {
        reviewsByDate[date].correct++
      } else {
        reviewsByDate[date].incorrect++
      }
    })

    const activityData = Object.entries(reviewsByDate).map(([date, data]) => ({
      date,
      correct: data.correct,
      incorrect: data.incorrect,
      total: data.correct + data.incorrect,
    }))

    return NextResponse.json({
      totalCards: totalCards || 0,
      dueToday: dueToday || 0,
      accuracy,
      streak,
      totalReviews: reviews?.length || 0,
      activityData,
    })
  } catch (error) {
    console.error("Progress error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
