"use client"

import { FileText, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FallbackMessage } from "@/lib/ai-types"

export function AiFallbackMessage({ fallback, className }: { fallback: FallbackMessage; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[11px] text-muted-foreground font-medium">
        Here&apos;s what I found in the docs for &quot;{fallback.query}&quot;
      </p>
      {fallback.sources.slice(0, 8).map((src, i) => (
        <a
          key={i}
          href={src.slug + (src.hash ? `#${src.hash}` : "")}
          className="block rounded-xl border p-3 hover:bg-accent transition-colors group"
        >
          <div className="flex items-start gap-2">
            <FileText className="size-4 shrink-0 mt-0.5 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                {src.title}
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-normal",
                  src.type === "docs"
                    ? "bg-primary/10 text-primary"
                    : "bg-orange-500/10 text-orange-600 dark:text-orange-400",
                )}>
                  {src.type}
                </span>
              </div>
              {src.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {src.description}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1 text-[11px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Read more
                <ArrowRight className="size-3" />
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
