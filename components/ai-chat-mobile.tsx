"use client"

import { useRef, useEffect, useState, type FormEvent, type KeyboardEvent } from "react"
import { Sparkles, Send, RefreshCw } from "lucide-react"
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { Drawer, DrawerContent, DrawerTitle, DrawerHeader, DrawerFooter } from "@/components/ui/drawer"
import { AiChatContent } from "@/components/ai-chat-content"
import type { AskAIReturn } from "@/lib/ai-types"

export function AiChatMobile({
  isOpen,
  onOpenChange,
  askAI,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
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
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95dvh] flex flex-col overflow-hidden">
        <DrawerTitle className="sr-only">Ask AI</DrawerTitle>
        <DrawerHeader className="flex flex-row items-center gap-2 px-4 h-10 border-b shrink-0">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-medium">Ask AI</span>
        </DrawerHeader>
        <div className="flex-1 min-h-0 overflow-y-auto" data-vaul-no-drag>
          <AiChatContent askAI={askAI} />
        </div>
        <DrawerFooter className="mt-0 shrink-0 border-t p-3">
          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
