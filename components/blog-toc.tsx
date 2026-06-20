"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { TOCItem } from "@/lib/toc"

export function BlogTOC({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    if (!items.length) return

    const headings = items
      .map((item) => ({ id: item.id, el: document.getElementById(item.id) }))
      .filter((h) => h.el)

    function update() {
      const scrollY = window.scrollY
      const atBottom = scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8
      if (atBottom) {
        setActiveId(headings.at(-1)?.id ?? "")
        return
      }
      let current = headings[0]?.id ?? ""
      for (const h of headings) {
        const top = h.el!.getBoundingClientRect().top + scrollY
        if (top <= scrollY + 120) {
          current = h.id
        } else break
      }
      setActiveId(current)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [items])

  if (!items.length) return null

  return (
    <aside className="sticky top-20 w-56 shrink-0 pt-1 max-xl:hidden">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </h3>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "text-sm transition-colors hover:text-foreground",
              item.level === 3 ? "pl-4" : "",
              activeId === item.id
                ? "font-medium text-primary"
                : "text-muted-foreground",
            )}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  )
}
