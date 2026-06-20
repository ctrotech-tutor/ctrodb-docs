"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { useAskAI } from "@/lib/use-ask-ai"
import { AiChatDesktop } from "@/components/ai-chat-desktop"
import { AiChatMobile } from "@/components/ai-chat-mobile"

type AiContext = {
  open: () => void
}

const AiCtx = createContext<AiContext>({ open: () => {} })

function subscribeMediaQuery(query: string) {
  return (callback: () => void) => {
    const mq = window.matchMedia(query)
    mq.addEventListener("change", callback)
    return () => mq.removeEventListener("change", callback)
  }
}

function getMediaQueryMatch(query: string) {
  return () => window.matchMedia(query).matches
}

function useDesktop() {
  return useSyncExternalStore(
    subscribeMediaQuery("(min-width: 1280px)"),
    getMediaQueryMatch("(min-width: 1280px)"),
    () => false,
  )
}

export function useAI() {
  return useContext(AiCtx)
}

function useSuppressPuterDialogs() {
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = "usage-limit-dialog { display: none !important; }"
    document.head.appendChild(style)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement && node.tagName === "USAGE-LIMIT-DIALOG") {
            node.remove()
          }
        }
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      style.remove()
      observer.disconnect()
    }
  }, [])
}

export function AiProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useDesktop()

  const close = useCallback(() => setIsOpen(false), [])
  const open = useCallback(() => setIsOpen(true), [])

  const askAI = useAskAI()

  useSuppressPuterDialogs()

  return (
    <AiCtx.Provider value={{ open }}>
      {children}
      {isDesktop ? (
        <AiChatDesktop isOpen={isOpen} onClose={close} askAI={askAI} />
      ) : (
        <AiChatMobile isOpen={isOpen} onOpenChange={setIsOpen} askAI={askAI} />
      )}
    </AiCtx.Provider>
  )
}
