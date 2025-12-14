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

    // Fetch due cards with lesson information
    const { data: cards, error } = await supabase
      .from("cards")
      .select(
        `
        *,
        lesson:lessons(*)
      `,
      )
      .eq("user_id", user.id)
      .lte("next_due", new Date().toISOString())
      .order("next_due", { ascending: true })

    if (error) {
      console.error("Error fetching due cards:", error)
      return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 })
    }

    return NextResponse.json({
      cards: cards || [],
      count: cards?.length || 0,
    })
  } catch (error) {
    console.error("Due cards error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
