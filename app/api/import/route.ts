import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface ImportRequest {
  title: string
  sourceType: "text" | "url"
  text?: string
  url?: string
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

    const body: ImportRequest = await request.json()
    const { title, sourceType, text, url } = body

    let rawText = ""

    if (sourceType === "text") {
      if (!text) {
        return NextResponse.json({ error: "Text content is required" }, { status: 400 })
      }
      rawText = text
    } else if (sourceType === "url") {
      if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 })
      }

      // Fetch content from URL
      try {
        const response = await fetch(url)
        const html = await response.text()

        // Basic HTML to text conversion (extract text from body)
        // In production, you'd use a library like cheerio or mozilla/readability
        rawText = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()

        if (!rawText || rawText.length < 100) {
          return NextResponse.json({ error: "Could not extract enough content from URL" }, { status: 400 })
        }
      } catch (err) {
        console.error("Error fetching URL:", err)
        return NextResponse.json({ error: "Failed to fetch content from URL" }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: "Invalid source type" }, { status: 400 })
    }

    // Store content in database
    const { data: content, error: dbError } = await supabase
      .from("contents")
      .insert({
        user_id: user.id,
        title,
        source_type: sourceType,
        source_url: sourceType === "url" ? url : null,
        raw_text: rawText,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
    }

    return NextResponse.json({
      contentId: content.id,
      message: "Content imported successfully",
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
