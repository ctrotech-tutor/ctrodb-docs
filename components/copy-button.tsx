"use client"

import { Clipboard, Check } from "lucide-react"
import { useState } from "react"

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      aria-label={label || "Copy Text"}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring p-1 [&_svg]:size-4 hover:text-accent-foreground"
    >
      {copied ? <Check className="text-green-500" /> : <Clipboard />}
    </button>
  )
}
