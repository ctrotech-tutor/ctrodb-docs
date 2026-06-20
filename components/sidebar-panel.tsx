"use client"

import { Search, PanelLeft } from "lucide-react"
import { useSidebar } from "@/lib/sidebar-context"
import { useSearch } from "@/lib/search-context"

export function SidebarPanel() {
  const { collapsed, toggle } = useSidebar()
  const { open } = useSearch()

  return (
    <div
      data-sidebar-panel=""
      className={`
        fixed flex top-[calc(1rem)] left-4 shadow-lg transition-opacity duration-200
        rounded-xl p-0.5 border bg-muted text-muted-foreground z-10
        ${collapsed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      <button
        type="button"
        aria-label="Collapse Sidebar"
        onClick={toggle}
        className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground p-1.5 [&_svg]:size-4.5 rounded-lg"
      >
        <PanelLeft />
      </button>
      <button
        type="button"
        data-search=""
        aria-label="Open Search"
        onClick={open}
        className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground p-1.5 [&_svg]:size-4.5 rounded-lg"
      >
        <Search />
      </button>
    </div>
  )
}
