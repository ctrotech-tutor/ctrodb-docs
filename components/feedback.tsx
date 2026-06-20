"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ThumbsUp, ThumbsDown } from "lucide-react"

type Feedback = "good" | "bad" | null

export function DocFeedback({ slug, title }: { slug?: string; title?: string }) {
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [sending, setSending] = useState(false)

  async function handleRate(rating: "good" | "bad") {
    const next = feedback === rating ? null : rating
    setFeedback(next)
    if (!next || !slug) return

    setSending(true)
    try {
      await fetch("/api/doc-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title, rating: next }),
      })
    } catch { /* silently fail — feedback is non-critical */ }
    setSending(false)
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <p className="text-sm font-medium pe-2 text-muted-foreground">How is this guide?</p>
      <button
        onClick={() => handleRate("good")}
        disabled={sending}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium border text-sm transition-colors",
          feedback === "good"
            ? "bg-primary/10 border-primary/30 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <ThumbsUp className="size-4" />
        Good
      </button>
      <button
        onClick={() => handleRate("bad")}
        disabled={sending}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium border text-sm transition-colors",
          feedback === "bad"
            ? "bg-destructive/10 border-destructive/30 text-destructive"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <ThumbsDown className="size-4" />
        Bad
      </button>
    </div>
  )
}
