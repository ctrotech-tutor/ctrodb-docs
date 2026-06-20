"use client"

import { usePathname } from "next/navigation"
import type { SidebarGroup as SidebarGroupType } from "@/lib/sidebar"
import { SidebarGroup } from "@/components/sidebar"

export function MobileSidebar({
  groups,
  onClose,
}: {
  groups: SidebarGroupType[]
  onClose?: () => void
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="overflow-hidden min-h-0 flex-1" style={{ position: "relative" }}>
        <style>{`
          [data-mobile-sidebar-viewport] {
            scrollbar-width: none;
            -ms-overflow-style: none;
            -webkit-overflow-scrolling: touch;
          }
          [data-mobile-sidebar-viewport]::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div
          data-mobile-sidebar-viewport=""
          className="size-full [&>*]:flex! [&>*]:flex-col! [&>*]:gap-0.5! px-4 overscroll-contain"
          style={{ overflow: "hidden scroll" }}
        >
          <div style={{ minWidth: "100%" }}>
            {groups.map((group) => (
              <SidebarGroup key={group.title} group={group} pathname={pathname} onLinkClick={onClose} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col border-t p-4 pt-2 empty:hidden" />
    </div>
  )
}
