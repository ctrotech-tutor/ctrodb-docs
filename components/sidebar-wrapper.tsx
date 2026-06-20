"use client"

import { useSidebar } from "@/lib/sidebar-context"
import { Sidebar } from "@/components/sidebar"
import type { SidebarGroup } from "@/lib/sidebar"

export function SidebarWrapper({ groups }: { groups: SidebarGroup[] }) {
  const { collapsed } = useSidebar()

  return (
    <aside
      className={`sticky top-0 h-dvh shrink-0 border-r border-border bg-card max-md:hidden transition-all duration-250 ${
        collapsed ? "w-0 overflow-hidden" : "w-[268px]"
      }`}
    >
      <Sidebar groups={groups} />
    </aside>
  )
}
