import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { getSidebar } from "@/lib/sidebar"
import type { ReactNode } from "react"

export default function DocsLayout({ children }: { children: ReactNode }) {
  const groups = getSidebar()

  return (
    <>
      <Navbar />
      <div className="mx-auto flex max-w-[90rem]">
        <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
            <Sidebar groups={groups} />
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </>
  )
}
