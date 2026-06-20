"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Play, RotateCcw, Share2, ChevronDown, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { PlaygroundCodeEditor } from "@/components/playground-code-editor"
import { PlaygroundOutput } from "@/components/playground-output"
import { runInSandbox, destroySandbox } from "@/lib/playground/sandbox"
import { EXAMPLES } from "@/lib/playground/examples"
import type { PlaygroundResult } from "@/lib/playground/types"

function getInitialCode(): string {
  if (typeof window !== "undefined") {
    try {
      const hash = window.location.hash
      if (hash.startsWith("#code=")) {
        const decoded = decodeURIComponent(atob(hash.slice(6)))
        if (decoded) return decoded
      }
    } catch { /* ignore */ }
  }
  return EXAMPLES[0].code
}

export function Playground() {
  const [code, setCode] = useState(getInitialCode)
  const [result, setResult] = useState<PlaygroundResult | null>(null)
  const [running, setRunning] = useState(false)
  const [selectedExample, setSelectedExample] = useState(0)
  const [showExamples, setShowExamples] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current = new AbortController()
  }, [])

  // Escape to exit fullscreen
  useEffect(() => {
    if (!fullscreen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFullscreen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [fullscreen])

  const runCode = useCallback(async (source: string) => {
    if (!source.trim()) return
    abortRef.current?.abort()
    const abort = new AbortController()
    abortRef.current = abort

    setRunning(true)
    setResult(null)

    try {
      const res = await runInSandbox(source, abort.signal)
      if (!abort.signal.aborted) {
        setResult(res)
      }
    } catch {
      if (!abort.signal.aborted) {
        setResult({ result: null, logs: [], error: "Failed to execute code", time: 0 })
      }
    }

    if (!abort.signal.aborted) {
      setRunning(false)
    }
  }, [])

  // Auto-run from shared URL
  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith("#code=")) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(6)))
        if (decoded && code === decoded) {
          const id = setTimeout(() => runCode(decoded), 300)
          return () => clearTimeout(id)
        }
      } catch { /* ignore */ }
    }
  }, [code, runCode])

  useEffect(() => {
    return () => {
      destroySandbox()
    }
  }, [])

  const handleRun = useCallback(() => {
    runCode(code)
  }, [code, runCode])

  const handleReset = useCallback(() => {
    abortRef.current?.abort()
    setCode(EXAMPLES[0].code)
    setResult(null)
    setRunning(false)
    setSelectedExample(0)
    window.location.hash = ""
  }, [])

  const handleShare = useCallback(async () => {
    try {
      const encoded = btoa(encodeURIComponent(code))
      const url = `${window.location.origin}/playground#code=${encoded}`
      await navigator.clipboard.writeText(url)
    } catch { /* ignore */ }
  }, [code])

  const handleExampleSelect = useCallback((idx: number) => {
    setSelectedExample(idx)
    setCode(EXAMPLES[idx].code)
    setResult(null)
    setShowExamples(false)
    window.location.hash = ""
  }, [])

  const example = EXAMPLES[selectedExample]

  return (
    <div className={cn("flex flex-col", fullscreen ? "fixed inset-0 z-50 bg-background" : "h-[calc(100dvh-3.5rem)]")}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b shrink-0 flex-wrap">
        {/* Examples dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
          >
            {example.name}
            <ChevronDown className="size-3" />
          </button>
          {showExamples && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowExamples(false)} />
              <div className="absolute left-0 top-full mt-1 z-20 w-64 rounded-xl border bg-popover shadow-lg p-1">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleExampleSelect(i)}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors"
                  >
                    <span className="font-medium">{ex.name}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                      {ex.description}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Run */}
        <button
          type="button"
          onClick={handleRun}
          disabled={!code.trim() || running}
          className="inline-flex items-center gap-1.5 px-4 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
        >
          {running ? (
            <div className="size-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
          ) : (
            <Play className="size-3.5" />
          )}
          {running ? "Running…" : "Run"}
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
        >
          <RotateCcw className="size-3.5" />
          Reset
        </button>

        <div className="h-5 w-px bg-border" />

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
        >
          <Share2 className="size-3.5" />
          Share
        </button>

        <div className="h-5 w-px bg-border" />

        {/* Fullscreen */}
        <button
          type="button"
          onClick={() => setFullscreen(!fullscreen)}
          className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
        >
          {fullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          {fullscreen ? "Exit" : "Fullscreen"}
        </button>

        {example && (
          <p className="text-[11px] text-muted-foreground/60 ml-auto hidden sm:block truncate max-w-75">
            {example.description}
          </p>
        )}
      </div>

      {/* Editor + Output */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row px-5">
        <div className="flex-1 min-h-0 lg:w-1/2 border-b lg:border-b-0 lg:border-r">
          <PlaygroundCodeEditor
            value={code}
            onChange={setCode}
            onRun={handleRun}
            className="h-full rounded-none border-0 bg-background"
          />
        </div>
        <div className="flex-1 min-h-0 lg:w-1/2 bg-muted/20">
          <PlaygroundOutput result={result} running={running} />
        </div>
      </div>
    </div>
  )
}
