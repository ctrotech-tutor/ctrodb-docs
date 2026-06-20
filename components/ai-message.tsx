"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { codeToHtml } from "shiki"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Components } from "react-markdown"

function ShikiCodeBlock({ language, children }: { language?: string; children: string }) {
  const [html, setHtml] = useState("")
  const [copied, setCopied] = useState(false)
  const lang = language || "plaintext"

  useEffect(() => {
    codeToHtml(children, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    }).then(setHtml)
  }, [children, lang])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }

  return (
    <div className="group relative rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 h-9 text-[11px] text-muted-foreground border-b bg-muted/30">
        <span>{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div
        className="code-block-ai p-2 overflow-x-auto text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

const components: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "")
    const isInline = !match && !className
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded-md bg-muted text-[13px] font-mono text-foreground"
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <ShikiCodeBlock language={match?.[1]}>
        {String(children).replace(/\n$/, "")}
      </ShikiCodeBlock>
    )
  },
  table({ children }) {
    return (
      <div className="my-3 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          {children}
        </table>
      </div>
    )
  },
  thead({ children }) {
    return <thead className="bg-muted/50">{children}</thead>
  },
  th({ children }) {
    return <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">{children}</th>
  },
  td({ children }) {
    return <td className="px-4 py-2.5 border-t text-foreground/80">{children}</td>
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-colors"
      >
        {children}
      </a>
    )
  },
  h1({ children }) {
    return <h1 className="text-lg font-semibold mt-5 mb-2">{children}</h1>
  },
  h2({ children }) {
    return <h2 className="text-base font-semibold mt-4 mb-2">{children}</h2>
  },
  h3({ children }) {
    return <h3 className="text-sm font-semibold mt-3 mb-1.5">{children}</h3>
  },
  ul({ children }) {
    return <ul className="list-disc pl-5 my-2 space-y-1 text-sm text-foreground/80">{children}</ul>
  },
  ol({ children }) {
    return <ol className="list-decimal pl-5 my-2 space-y-1 text-sm text-foreground/80">{children}</ol>
  },
  p({ children }) {
    return <p className="text-sm text-foreground/80 leading-relaxed my-2">{children}</p>
  },
  hr() {
    return <hr className="my-4 border-border" />
  },
  blockquote({ children }) {
    return (
      <blockquote className="border-l-2 border-primary/30 pl-4 my-3 text-sm text-muted-foreground italic">
        {children}
      </blockquote>
    )
  },
}

export function AiMessage({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
