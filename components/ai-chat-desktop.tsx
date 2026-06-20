"use client"

import { useRef, useEffect, useState, type FormEvent, type KeyboardEvent } from "react"
import { Sparkles, Send, RefreshCw } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { AiChatContent } from "@/components/ai-chat-content"
import type { AskAIReturn } from "@/lib/ai-types"

export function AiChatDesktop({
  isOpen,
  onClose,
  askAI,
}: {
  isOpen: boolean
  onClose: () => void
  askAI: AskAIReturn
}) {
  const { ask, history, streaming, clearHistory, stop } = askAI
  const [input, setInput] = useState("")
  const textRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) textRef.current?.focus()
  }, [isOpen])

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault()
    if (!input.trim() || streaming) return
    ask(input.trim())
    setInput("")
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="md:w-2xs lg:w-1/4 sm:max-w-none p-0 flex flex-col max-xl:hidden gap-0"
      >
        <SheetHeader className="flex-row items-center justify-between px-4 h-12 border-b shrink-0 space-y-0">
          <SheetTitle className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-primary" />
            Ask AI
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <AiChatContent askAI={askAI} />
        </div>

        <div className="border-t p-3 shrink-0">
          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <RefreshCw className="size-3" />
              Clear conversation
            </button>
          )}
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <InputGroupTextarea
                ref={textRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question…"
                maxLength={2000}
                rows={1}
                disabled={streaming}
                className="max-h-32 resize-none"
              />
              <InputGroupAddon align="block-end" className="justify-between">
                <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                  {input.length}/{2000}
                </span>
                {streaming ? (
                  <InputGroupButton type="button" size="xs" onClick={stop}>
                    Stop
                  </InputGroupButton>
                ) : (
                  <InputGroupButton
                    type="submit"
                    size="xs"
                    disabled={!input.trim()}
                  >
                    <Send className="size-3.5" />
                  </InputGroupButton>
                )}
              </InputGroupAddon>
            </InputGroup>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}