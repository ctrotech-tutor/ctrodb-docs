"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CopyMarkdown({ raw }: { raw: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(raw)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can fail (permissions, insecure context) — fail silently
      // rather than leaving the button stuck or throwing an unhandled error.
    }
  }

  return (
    <Button
      variant="secondary"
      size="default"
      onClick={handleCopy}
      className="gap-1.5"
      aria-live="polite"
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-emerald-500" />
          Copy Markdown
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          Copy Markdown
        </>
      )}
    </Button>
  )
}