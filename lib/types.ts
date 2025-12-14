export interface Profile {
  id: string
  display_name: string | null
  created_at: string
  updated_at: string
}

export interface Content {
  id: string
  user_id: string
  title: string
  source_type: "text" | "pdf" | "url"
  source_url: string | null
  raw_text: string
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  content_id: string
  user_id: string
  title: string
  bullets: string[]
  explanation: string
  created_at: string
}

export interface Card {
  id: string
  lesson_id: string
  user_id: string
  card_type: "mcq" | "short"
  prompt: string
  choices: string[] | null
  answer: number | string // index for MCQ, text for short
  ef: number
  interval: number
  reps: number
  next_due: string
  created_at: string
}

export interface Review {
  id: string
  card_id: string
  user_id: string
  quality: number
  created_at: string
}

export interface CardWithLesson extends Card {
  lesson: Lesson
}
