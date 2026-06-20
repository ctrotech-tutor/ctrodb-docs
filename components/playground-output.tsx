"use client"

import { useState } from "react"
import { Check, Copy, Terminal, Braces, AlertCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PlaygroundResult, OutputTab } from "@/lib/playground/types"

export function PlaygroundOutput({
  result,
  running,
}: {
  result: PlaygroundResult | null
  running: boolean
}) {
  const [tab, setTab] = useState<OutputTab>("result")
  const [copied, setCopied] = useState(false)

  async function handleCopyResult() {
    if (!result) return
    const text = result.error
      ? result.error
      : JSON.stringify(result.result, null, 2) || String(result.result)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  const hasResult = result && !result.error && result.result !== undefined
  const hasError = result && result.error
  const hasLogs = result && result.logs.length > 0

  if (running) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-3.5 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
          Running…
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-sm text-muted-foreground">
        Hit Run or press Ctrl+Enter to execute
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-0.5 border-b px-3 shrink-0">
        <button
          type="button"
          onClick={() => setTab("result")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px",
            tab === "result"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <Braces className="size-3" />
          Result
        </button>
        <button
          type="button"
          onClick={() => setTab("console")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px",
            tab === "console"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <Terminal className="size-3" />
          Console
          {hasLogs && (
            <span className="text-[10px] text-muted-foreground/60 ml-0.5">
              ({result.logs.length})
            </span>
          )}
        </button>
        {hasError && (
          <button
            type="button"
            onClick={() => setTab("result")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 border-destructive/50 text-destructive -mb-px"
          >
            <AlertCircle className="size-3" />
            Error
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60 tabular-nums shrink-0">
            <Clock className="size-3" />
            {result.time}ms
          </span>
          {hasResult && (
            <button
              type="button"
              onClick={handleCopyResult}
              className="p-1 rounded hover:bg-accent transition-colors shrink-0"
            >
              {copied ? (
                <Check className="size-3 text-emerald-500" />
              ) : (
                <Copy className="size-3 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto p-3">
        {tab === "result" && (
          <div className="font-mono text-xs leading-relaxed">
            {hasError ? (
              <pre className="text-destructive whitespace-pre-wrap">{result.error}</pre>
            ) : hasResult ? (
              <pre className="text-foreground/80 whitespace-pre-wrap">
                {JSON.stringify(result.result, null, 2)}
              </pre>
            ) : (
              <span className="text-muted-foreground italic">No return value (undefined)</span>
            )}
          </div>
        )}
        {tab === "console" && (
          <div className="font-mono text-xs leading-relaxed space-y-1">
            {hasLogs ? (
              result.logs.map((log, i) => (
                <pre key={i} className="text-foreground/70 whitespace-pre-wrap">
                  {log}
                </pre>
              ))
            ) : (
              <span className="text-muted-foreground italic">No console output</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
