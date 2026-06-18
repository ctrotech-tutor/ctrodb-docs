"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { SidebarGroup } from "@/lib/sidebar"

function SidebarGroup({ group, pathname }: { group: SidebarGroup; pathname: string }) {
  const [open, setOpen] = useState(true)
  const isActive = group.items.some((item) => pathname === `/docs/${item.slug}`)

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center gap-1 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground",
          isActive && "text-foreground",
        )}
      >
        <ChevronDown
          className={cn("size-3 transition-transform", open && "rotate-0", !open && "-rotate-90")}
        />
        {group.title}
      </button>
      {open && (
        <div className="mt-1 flex flex-col gap-0.5">
          {group.items.map((item) => {
            const active = pathname === `/docs/${item.slug}`
            return (
              <Link
                key={item.slug}
                href={`/docs/${item.slug}`}
                className={cn(
                  "relative rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.title}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col">
      {groups.map((group) => (
        <SidebarGroup key={group.title} group={group} pathname={pathname} />
      ))}
    </nav>
  )
}
