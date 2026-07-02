"use client"

import { useState, useEffect } from "react"
import { Link, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DocShare({ version, slug, title, description }: { version: string; slug: string; title: string; description?: string }) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare("share" in navigator)
  }, [])

  const url = `https://ctrodb.vercel.app/docs/${version}/${slug}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  async function handleShare() {
    if (canShare) {
      try {
        await navigator.share({
          title: `${title} | ctrodb`,
          text: description || title,
          url,
        })
      } catch { /* user cancelled or error */ }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="flex gap-1">
      <Button variant="secondary" size="default" onClick={handleCopy} className="gap-1.5" aria-label="Copy link">
        {copied ? <Check className="size-3.5 text-emerald-500" /> : <Link className="size-3.5" />}
        <span className="hidden sm:inline">{copied ? "Copied link" : "Copy link"}</span>
      </Button>
      {canShare && (
        <Button variant="secondary" size="default" onClick={handleShare} className="gap-1.5" aria-label="Share">
          <Share2 className="size-3.5" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      )}
    </div>
  )
}
