"use client"

import { useRef, useEffect, useState } from "react"
import { Sparkles, FileText, ArrowRight, Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { AiMessage } from "@/components/ai-message"
import { AiFallbackMessage } from "@/components/ai-fallback-message"
import type { AskAIReturn } from "@/lib/ai-types"

function MessageActions({
  content,
  messageIdx,
  ratings,
  onRate,
}: {
  content: string
  messageIdx: number
  ratings: Record<number, "like" | "dislike">
  onRate: (idx: number, rating: "like" | "dislike") => void
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }

  const current = ratings[messageIdx]

  return (
    <div className="flex items-center gap-1 pt-1.5">
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors px-1 py-0.5 rounded"
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <span className="text-muted-foreground/20">|</span>
      <button
        type="button"
        onClick={() => onRate(messageIdx, "like")}
        className={cn(
          "p-0.5 rounded transition-colors",
          current === "like"
            ? "text-primary"
            : "text-muted-foreground/50 hover:text-foreground",
        )}
      >
        <ThumbsUp className="size-3" />
      </button>
      <button
        type="button"
        onClick={() => onRate(messageIdx, "dislike")}
        className={cn(
          "p-0.5 rounded transition-colors",
          current === "dislike"
            ? "text-destructive"
            : "text-muted-foreground/50 hover:text-foreground",
        )}
      >
        <ThumbsDown className="size-3" />
      </button>
    </div>
  )
}

function FallbackBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
      <p>Responses may not be as smart right now</p>
      <button
        type="button"
        onClick={onRetry}
        className="underline underline-offset-2 hover:no-underline mt-1"
      >
        Retry AI
      </button>
    </div>
  )
}

export function AiChatContent({ askAI, className }: { askAI: AskAIReturn; className?: string }) {
  const { ask, history, streaming, streamedText, error, suggestedQuestions, fallbackMode, retryAI, fallbackMessages } = askAI
  const chatRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const [ratings, setRatings] = useState<Record<number, "like" | "dislike">>({})

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [history, streamedText, fallbackMessages])

  function handleRate(messageIdx: number, rating: "like" | "dislike") {
    setRatings((prev) => {
      const next = prev[messageIdx] === rating ? {} : { [messageIdx]: rating }
      return { ...prev, ...next }
    })

    const msg = history[messageIdx]
    if (!msg || msg.role !== "assistant") return
    const isLike = ratings[messageIdx] === rating ? null : rating
    if (!isLike) return

    fetch("/api/ai-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: history[messageIdx - 1]?.content || "",
        response: msg.content,
        rating: isLike,
        sources: msg.sources,
      }),
    }).catch(() => {})
  }

  function handleSuggested(q: string) {
    ask(q)
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <div ref={chatRef} className="flex-1 min-h-0 overflow-y-auto" data-vaul-no-drag>
        {history.length === 0 && !streaming && fallbackMessages.length === 0 ? (
          <div className="p-4 space-y-3">
            <div className="text-center py-6">
              <Sparkles className="size-8 mx-auto text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Ask anything about ctrodb</p>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              <p className="text-xs text-muted-foreground px-1">Suggested</p>
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSuggested(q)}
                  className="block w-full text-left text-sm rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors wrap-break-words"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-5">
            {fallbackMode && <FallbackBanner onRetry={retryAI} />}
            {history.map((msg, i) => (
              <div key={i}>
                <div className={cn("flex gap-2", msg.role === "assistant" ? "" : "flex-row-reverse")}>
                  <div
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm max-w-[90%]",
                      msg.role === "assistant"
                        ? "bg-transparent text-foreground"
                        : "bg-primary text-primary-foreground",
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <AiMessage content={msg.content} />
                    ) : (
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    )}
                  </div>
                </div>
                {msg.role === "assistant" && (
                  <div className="mt-1.5 space-y-0.5">
                    {msg.sources.length > 0 && (
                      <>
                        <p className="text-[10px] text-muted-foreground px-1 font-medium pt-1">
                          Sources
                        </p>
                        {msg.sources.slice(0, 4).map((s, j) => (
                          <a
                            key={j}
                            href={s.slug + (s.hash ? `#${s.hash}` : "")}
                            className="flex items-center gap-1 text-[11px] px-1 py-0.5 text-muted-foreground hover:text-foreground truncate"
                          >
                            <FileText className="size-3 shrink-0" />
                            <span className="truncate">
                              {s.title}
                              {s.section && s.section !== s.description ? ` — ${s.section}` : ""}
                            </span>
                          </a>
                        ))}
                      </>
                    )}
                    <MessageActions
                      content={msg.content}
                      messageIdx={i}
                      ratings={ratings}
                      onRate={handleRate}
                    />
                    {i === history.length - 1 && suggestedQuestions.length > 0 && (
                      <div className="pt-3 max-h-36 overflow-y-auto space-y-1">
                        <p className="text-xs text-muted-foreground px-1">Try next</p>
                        {suggestedQuestions.slice(0, 5).map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => handleSuggested(q)}
                            className="flex items-start gap-1.5 text-left text-xs rounded-lg px-2.5 py-1.5 w-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          >
                            <ArrowRight className="size-3 shrink-0 mt-0.5" />
                            <span className="wrap-break-words">{q}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {fallbackMessages.map((fb, i) => (
              <AiFallbackMessage key={`fb-${i}`} fallback={fb} />
            ))}
            {streaming && streamedText && (
              <div className="flex gap-2">
                <div className="rounded-xl px-3 py-2 text-sm max-w-[90%] bg-transparent text-foreground">
                  <AiMessage content={streamedText} />
                  <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 rounded-sm align-text-bottom" />
                </div>
              </div>
            )}
            {streaming && !streamedText && (
              <div className="flex gap-2">
                <div className="rounded-xl px-3 py-2 text-sm bg-muted text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="size-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="size-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="size-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            {error && !fallbackMode && (
              <div className="text-sm text-destructive px-1 py-2">{error}</div>
            )}
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  )
}
