import { createClient } from "@/lib/supabase/server"
import { generateLessons } from "@/lib/llm"
import { NextResponse } from "next/server"

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

    const { contentId } = await request.json()

    if (!contentId) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 })
    }

    // Fetch the content
    const { data: content, error: contentError } = await supabase
      .from("contents")
      .select("*")
      .eq("id", contentId)
      .eq("user_id", user.id)
      .single()

    if (contentError || !content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    // Generate lessons using LLM
    const lessons = await generateLessons(content.raw_text)

    // Store lessons and cards in database
    const lessonIds: string[] = []
    let totalCards = 0

    for (const lesson of lessons) {
      // Insert lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from("lessons")
        .insert({
          content_id: contentId,
          user_id: user.id,
          title: lesson.title,
          bullets: lesson.bullets,
          explanation: lesson.explanation,
        })
        .select()
        .single()

      if (lessonError || !lessonData) {
        console.error("Error inserting lesson:", lessonError)
        continue
      }

      lessonIds.push(lessonData.id)

      // Insert cards (quiz questions) for this lesson
      for (const question of lesson.quiz) {
        const { error: cardError } = await supabase.from("cards").insert({
          lesson_id: lessonData.id,
          user_id: user.id,
          card_type: question.type,
          prompt: question.prompt,
          choices: question.type === "mcq" ? question.options : null,
          answer: question.answer,
        })

        if (cardError) {
          console.error("Error inserting card:", cardError)
        } else {
          totalCards++
        }
      }
    }

    return NextResponse.json({
      message: "Lessons generated successfully",
      lessonIds,
      lessonsCreated: lessonIds.length,
      cardsCreated: totalCards,
    })
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate lessons",
      },
      { status: 500 },
    )
  }
}
