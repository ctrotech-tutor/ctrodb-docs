"use client"

import { MessageCircle } from "lucide-react"
import { useAI } from "@/lib/ai-context"

export function AskAIButton() {
  const { open } = useAI()

  return (
    <button
      type="button"
      onClick={open}
      className="fixed bottom-4 gap-3 right-4 shadow-lg z-20 inline-flex items-center justify-center p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border bg-secondary hover:bg-accent hover:text-accent-foreground text-muted-foreground rounded-2xl"
    >
      <MessageCircle className="size-4.5" />
      Ask AI
    </button>
  )
}
