"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type MiniSearch from "minisearch"
import type { AskAIMessage, SearchResult, AskAIReturn, Intent, FallbackMessage } from "./ai-types"
import { buildPrompt, isGreeting } from "./prompt"
import { estimateTokens, truncateToBudget } from "./token-budget"
import { getSearchEngine } from "./search-engine"
import { getSearchIndex } from "./search-index"

const GREETING_RESPONSES = [
  "Hey! I can help you with ctrodb. What would you like to know?",
  "Hello! Ask me anything about ctrodb — databases, queries, React hooks, or adapters.",
  "Hi there! I'm your ctrodb assistant. Try asking about setup, schemas, or features.",
]

function classifyIntent(question: string): Intent {
  const q = question.trim().toLowerCase()
  if (isGreeting(question)) return "greeting"
  const complexSignals = /compare|explain.*difference|full example|complete.*(guide|tutorial)|write.*app|build.*project|architecture|design.*pattern|benchmark|performance|migration|deep.*dive/i
  if (complexSignals.test(q) || q.split(" ").length > 18) return "complex"
  const moderateSignals = /how (do|to|can)|show|example|what is the|tell me about|difference|vs|versus|why would|when to|best way/i
  if (moderateSignals.test(q) || q.split(" ").length > 8) return "moderate"
  return "simple"
}

function buildContext(sections: SearchResult[], budget: number): string {
  if (sections.length === 0) return ""
  const mapped = sections.map((s) => ({
    content: `[${sections.indexOf(s) + 1}] ${s.title}${s.section ? ` — ${s.section}` : ""} (${s.type})\n${s.content}`,
    score: s.score,
  }))
  return truncateToBudget(mapped, budget)
}

function buildHistory(messages: AskAIMessage[], maxTokens: number): string {
  if (messages.length === 0) return ""
  const parts: string[] = []
  let total = 0
  for (let i = messages.length - 1; i >= 0; i -= 2) {
    const user = messages[i - 1]
    const asst = messages[i]
    if (!user || !asst) break
    const pair = `User: ${user.content.slice(0, 1000)}\nAssistant: ${asst.content.slice(0, 1000)}`
    const tokens = estimateTokens(pair)
    if (total + tokens > maxTokens) break
    parts.unshift(pair)
    total += tokens
  }
  return parts.join("\n")
}

function needsWebSearch(question: string): boolean {
  const signals = [
    "compare", "vs ", " versus ", "alternative",
    "latest", "new in", "news", "update",
    "version", "changelog", "release",
    "npm", "npmjs", "package", "downloads",
    "github", "stars", "repository",
    "react 19", "react 18",
    "stack overflow", "issue",
    "license", "bundle size", "bundlephobia", "benchmark",
    "not working", "error", "bug", "bugfix",
    "tutorial", "guide", "opinion",
  ]
  const q = question.toLowerCase()
  return signals.some((s) => q.includes(s))
}

async function searchWeb(query: string): Promise<string> {
  try {
    const res = await fetch(`/api/web-search?q=${encodeURIComponent(query)}`)
    if (!res.ok) return ""
    const data = await res.json()
    return (data.results || "").slice(0, 2000)
  } catch {
    return ""
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let puterInstance: any = null

async function getPuter() {
  if (puterInstance) return puterInstance
  const mod = await import("@heyputer/puter.js")
  puterInstance = mod.puter
  return puterInstance as Exclude<typeof puterInstance, null>
}

const INTENT_BUDGETS: Record<Intent, { history: number; context: number; webResults: number; model: string }> = {
  greeting: { history: 0, context: 0, webResults: 0, model: "gemini-3.5-flash" },
  simple: { history: 400, context: 600, webResults: 400, model: "gemini-3.5-flash" },
  moderate: { history: 600, context: 1200, webResults: 600, model: "gemini-3.5-flash" },
  complex: { history: 800, context: 2000, webResults: 800, model: "claude-sonnet-4-6" },
}

const GREETING_QUESTIONS = [
  "What is ctrodb?",
  "How do I create a database?",
  "How does querying work?",
  "What React hooks are available?",
  "How do I use adapters?",
]

export function useAskAI(): AskAIReturn {
  const [history, setHistory] = useState<AskAIMessage[]>([])
  const [streaming, setStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState("")
  const [currentSources, setCurrentSources] = useState<SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([...GREETING_QUESTIONS])
  const [fallbackMode, setFallbackMode] = useState(false)
  const [fallbackMessages, setFallbackMessages] = useState<FallbackMessage[]>([])
  const modelRef = useRef<string>("gemini-3.5-flash")
  const engineRef = useRef<MiniSearch | null>(null)
  const loadedRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  const ensureLoaded = useCallback(async () => {
    if (loadedRef.current) return

    const [ms, data] = await Promise.all([getSearchEngine(), getSearchIndex()])
    engineRef.current = ms
    loadedRef.current = true

    // Build suggested questions from categories
    const categories = new Map<string, { slug: string; title: string }[]>()
    for (const entry of data) {
      if (!categories.has(entry.category)) categories.set(entry.category, [])
      const arr = categories.get(entry.category)!
      if (arr.length < 2) arr.push({ slug: entry.slug, title: entry.title })
    }
    const questions: string[] = []
    const templates = [
      (t: string) => `How do I use ${t}?`,
      (t: string) => `What is ${t}?`,
      (t: string) => `Show me an example of ${t}`,
      (t: string) => `How does ${t} work?`,
      (t: string) => `What adapters support ${t}?`,
    ]
    let idx = 0
    for (const [, entries] of categories) {
      if (questions.length >= 6) break
      if (entries[0]) {
        const tmpl = templates[idx % templates.length]
        questions.push(tmpl(entries[0].title.toLowerCase()))
        idx++
      }
    }
    setSuggestedQuestions(questions.length > 0 ? questions : GREETING_QUESTIONS)
  }, [])

  useEffect(() => {
    ensureLoaded()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setStreaming(false)
  }, [])

  const retryAI = useCallback(() => {
    setFallbackMode(false)
    setError(null)
  }, [])

  const ask = useCallback(
    async (question: string) => {
      if (!question.trim()) return

      // Abort any in-flight
      abortRef.current?.abort()
      const abort = new AbortController()
      abortRef.current = abort

      setError(null)
      setStreaming(true)
      setStreamedText("")

      const intent = classifyIntent(question)
      const budgets = INTENT_BUDGETS[intent]

      // --- Greeting: local response, no AI call ---
      if (intent === "greeting") {
        const greeting = GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)]
        const userMsg: AskAIMessage = { role: "user", content: question, sources: [] }
        const assistantMsg: AskAIMessage = { role: "assistant", content: greeting, sources: [] }
        setHistory((prev) => [...prev, userMsg, assistantMsg])
        setStreaming(false)
        return
      }

      // --- Ensure search index loaded ---
      try {
        await ensureLoaded()
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load search index"
        setError(message)
        setStreaming(false)
        return
      }

      const ms = engineRef.current
      if (!ms) {
        setError("Search index not available")
        setStreaming(false)
        return
      }

      // --- Multi-query retrieval ---
      const queries = [question]
      if (intent === "complex") {
        if (question.includes("how")) {
          queries.push(question.replace(/how/i, "").trim())
        }
        if (question.toLowerCase().startsWith("what is")) {
          queries.push(question.replace(/what is/i, "how does").trim() + " work")
        }
      }

      const seen = new Set<string>()
      const allSections: SearchResult[] = []

      for (const q of queries) {
        const raw = ms.search(q, {
          boost: { title: 6, section: 3, content: 1 },
          fuzzy: 0.25,
          prefix: true,
        })
        const limit = intent === "simple" ? 6 : intent === "moderate" ? 12 : 20
        for (const item of raw.slice(0, limit) as unknown as SearchResult[]) {
          if (!seen.has(item.id)) {
            seen.add(item.id)
            allSections.push(item)
          }
        }
      }

      allSections.sort((a, b) => b.score - a.score)
      const topSections = allSections.slice(0, budgets.context > 1000 ? 20 : 10)
      topSections.sort((a, b) => {
        const aHasCode = a.content.includes("```") ? 1 : 0
        const bHasCode = b.content.includes("```") ? 1 : 0
        return bHasCode - aHasCode || b.score - a.score
      })

      const docLimit = intent === "simple" ? 4 : intent === "moderate" ? 8 : 16
      const blogLimit = intent === "complex" ? 2 : 0
      const sections = topSections.filter((s) => s.type === "docs").slice(0, docLimit)
      const blogs = topSections.filter((s) => s.type === "blog").slice(0, blogLimit)
      const finalSections = [...sections, ...blogs]
      setCurrentSources(finalSections)

      // --- Web search ---
      let webResults = ""
      if (needsWebSearch(question)) {
        webResults = await searchWeb(question)
        if (estimateTokens(webResults) > budgets.webResults) {
          webResults = webResults.slice(0, budgets.webResults * 3) + "…"
        }
      }

      // --- Build prompt ---
      const context = buildContext(finalSections, budgets.context)
      const conversationHistory = buildHistory(history, budgets.history)
      const prompt = buildPrompt(question, context, webResults, conversationHistory)

      // --- Determine model ---
      const model = intent === "complex" ? budgets.model : modelRef.current

      try {
        const puter = await getPuter()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await puter.ai.chat(prompt, {
          model,
          stream: true,
          signal: abort.signal,
        })

        let fullText = ""
        for await (const part of response) {
          if (abort.signal.aborted) break
          if (part?.text) {
            fullText += part.text
            setStreamedText(fullText)
          }
        }

        if (abort.signal.aborted) {
          setStreaming(false)
          return
        }

        const userMsg: AskAIMessage = { role: "user", content: question, sources: [] }
        const assistantMsg: AskAIMessage = {
          role: "assistant",
          content: fullText,
          sources: finalSections,
        }
        setHistory((prev) => [...prev, userMsg, assistantMsg])
        setStreamedText("")

        // Extract follow-up suggestions
        const followUpRegex = /(?:\*\*Try next\*\*|Try next):\s*"([^"]+)"|(?:\*\*Try next\*\*|Try next):\s*([^\n"]+)/g
        const followUps = [...fullText.matchAll(followUpRegex)]
          .map((m) => (m[1] || m[2]).trim())
          .filter(Boolean)
        if (followUps.length > 0) {
          setSuggestedQuestions(followUps)
        }
      } catch (err: unknown) {
        if (abort.signal.aborted) {
          setStreaming(false)
          return
        }

        console.error("Ask AI failed:", err)

        // If claude-sonnet failed, try gemini first
        if (model === "claude-sonnet-4-6") {
          try {
            const puter = await getPuter()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await puter.ai.chat(prompt, {
              model: "gemini-3.5-flash",
              stream: true,
              signal: abort.signal,
            })
            let fullText = ""
            for await (const part of response) {
              if (abort.signal.aborted) break
              if (part?.text) {
                fullText += part.text
                setStreamedText(fullText)
              }
            }
            if (!abort.signal.aborted && fullText) {
              const userMsg: AskAIMessage = { role: "user", content: question, sources: [] }
              const assistantMsg: AskAIMessage = { role: "assistant", content: fullText, sources: finalSections }
              setHistory((prev) => [...prev, userMsg, assistantMsg])
              setStreamedText("")
              return
            }
          } catch {
            // Fall through to fallback
          }
        }

        // Fallback mode
        if (!fallbackMode) {
          setFallbackMode(true)
          setFallbackMessages((prev) => [
            ...prev,
            { sources: finalSections.slice(0, 8), query: question },
          ])
        }
        const message = err instanceof Error ? err.message : "Failed to get AI response"
        setError(message)
        setStreamedText("")
      } finally {
        if (!abort.signal.aborted) {
          setStreaming(false)
        }
        abortRef.current = null
      }
    },
    [history, ensureLoaded, fallbackMode],
  )

  const setModel = useCallback((model: string) => {
    modelRef.current = model
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    setStreamedText("")
    setCurrentSources([])
    setError(null)
    setFallbackMode(false)
    setFallbackMessages([])
  }, [])

  return {
    ask,
    history,
    streaming,
    streamedText,
    currentSources,
    error,
    setModel,
    clearHistory,
    stop,
    suggestedQuestions,
    fallbackMode,
    retryAI,
    fallbackMessages,
  }
}
