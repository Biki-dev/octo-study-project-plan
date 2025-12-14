// LLM utilities for generating lessons and quizzes

export interface QuizQuestion {
  type: "mcq" | "short"
  prompt: string
  options?: string[] // for MCQ
  answer: number | string // index for MCQ, text for short
  explanation?: string
}

export interface MicroLesson {
  title: string
  bullets: string[]
  explanation: string
  quiz: QuizQuestion[]
}

const LESSON_GENERATION_PROMPT = `
You are an expert teacher creating structured micro-lessons.

CRITICAL OUTPUT RULES (must follow exactly):
- Output MUST be valid JSON
- Output MUST begin with "{" and end with "}"
- Do NOT use markdown
- Do NOT use triple backticks
- Do NOT include explanations outside the JSON
- Do NOT include comments
- Do NOT include trailing commas

TASK:
Given the content below, generate EXACTLY 3 micro-lessons.

Each micro-lesson MUST:
- Have a clear, one-line title (string)
- Include 3–5 bullet-point facts (array of strings)
- Include a 30–50 word plain-language explanation (string)
- Include EXACTLY 3 quiz questions:
  - 2 multiple-choice questions (MCQ)
    * 4 options each
    * "answer" must be an integer from 0–3
  - 1 short-answer question

JSON FORMAT (must match exactly):
{
  "lessons": [
    {
      "title": "Lesson title here",
      "bullets": ["Fact 1", "Fact 2", "Fact 3"],
      "explanation": "Clear explanation connecting the concepts...",
      "quiz": [
        {
          "type": "mcq",
          "prompt": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": 0,
          "explanation": "Why this is correct..."
        },
        {
          "type": "mcq",
          "prompt": "Another question?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": 2,
          "explanation": "Explanation..."
        },
        {
          "type": "short",
          "prompt": "Short answer question?",
          "answer": "Expected answer here",
          "explanation": "What to look for in the answer..."
        }
      ]
    }
  ]
}

CONTENT: to analyze:
`

function safeParseJSON(text: string) {
  const cleaned = text
    .trim()
    // Remove markdown fences if they appear
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    // Remove leading/trailing junk
    .replace(/^[^{]+/, "")
    .replace(/[^}]+$/, "")

  return JSON.parse(cleaned)
}


export async function generateLessons(content: string): Promise<MicroLesson[]> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set")
  }

  // Limit content length to avoid token limits
  const truncatedContent = content.slice(0, 8000)

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://octostudy.vercel.app",
        "X-Title": "OctoStudy",
      },
      body: JSON.stringify({
        model: "tngtech/deepseek-r1t2-chimera:free",
        messages: [
          {
            role: "system",
            content:
              "You are an expert educational content creator. You create clear, accurate micro-lessons with effective quiz questions. Always return valid JSON only.",
          },
          {
            role: "user",
            content: LESSON_GENERATION_PROMPT + truncatedContent,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("OpenRouter API error:", error)
      throw new Error(`OpenRouter API error: ${error.error?.message || "Unknown error"}`)
    }

    const data = await response.json()
    const content_text = data.choices[0]?.message?.content

    if (!content_text) {
      throw new Error("No content generated")
    }

    // Parse the JSON response
    const parsed = safeParseJSON(content_text)

    if (!parsed.lessons || !Array.isArray(parsed.lessons)) {
      throw new Error("Invalid response format")
    }

    return parsed.lessons
  } catch (error) {
    console.error("Error generating lessons:", error)
    throw error
  }
}
