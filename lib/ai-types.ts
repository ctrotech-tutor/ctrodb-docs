export type SearchResult = {
  id: string
  hash: string
  slug: string
  title: string
  description: string
  section: string
  content: string
  type: "docs" | "blog"
  category: string
  score: number
  terms: string[]
}

export type AskAIMessage = {
  role: "user" | "assistant"
  content: string
  sources: SearchResult[]
}

export type Intent = "greeting" | "simple" | "moderate" | "complex"

export type FallbackMessage = {
  sources: SearchResult[]
  query: string
}

export type AskAIReturn = {
  ask: (q: string) => Promise<void>
  history: AskAIMessage[]
  streaming: boolean
  streamedText: string
  currentSources: SearchResult[]
  error: string | null
  setModel: (m: string) => void
  clearHistory: () => void
  stop: () => void
  suggestedQuestions: string[]
  fallbackMode: boolean
  retryAI: () => void
  fallbackMessages: FallbackMessage[]
}
