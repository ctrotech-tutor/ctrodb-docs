import { Subnav } from "@/components/subnav"
import { SidebarWrapper } from "@/components/sidebar-wrapper"
import { SidebarPanel } from "@/components/sidebar-panel"
import { AskAIButton } from "@/components/ask-ai-button"
import { SidebarProvider } from "@/lib/sidebar-context"
import { getSidebar } from "@/lib/sidebar"
import type { ReactNode } from "react"

export default function DocsLayout({ children }: { children: ReactNode }) {
  const groups = getSidebar()

  return (
    <SidebarProvider>
      <Subnav groups={groups} />
        <div className="flex">
          <SidebarWrapper groups={groups} />
          <SidebarPanel />
          <main className="min-w-0 flex-1">
            {children}
          </main>
        </div>
        <AskAIButton />
      </SidebarProvider>
  )
}
