import { Subnav } from "@/components/subnav"
import { SidebarWrapper } from "@/components/sidebar-wrapper"
import { SidebarPanel } from "@/components/sidebar-panel"
import { AskAIButton } from "@/components/ask-ai-button"
import { SidebarProvider } from "@/lib/sidebar-context"
import { getSidebar } from "@/lib/sidebar"
import { isValidVersion } from "@/lib/versions"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

export default async function VersionedDocsLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ version: string }>
}) {
  const { version } = await params

  if (!isValidVersion(version)) {
    notFound()
  }

  const groups = getSidebar(version)

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
