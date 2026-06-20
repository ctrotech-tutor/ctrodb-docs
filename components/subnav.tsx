"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Search, PanelLeft } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSearch } from "@/lib/search-context"
import type { SidebarGroup } from "@/lib/sidebar"

export function Subnav({ groups }: { groups: SidebarGroup[] }) {
  const { open } = useSearch()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      id="nd-subnav"
      data-transparent="false"
      className="[grid-area:header] sticky top-0 z-30 flex items-center ps-4 pe-2.5 border-b transition-colors backdrop-blur-sm h-14 bg-background/80 md:hidden"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2.5 font-semibold me-auto"
      >
        <Image
          src="/icon.svg"
          alt="ctrodb"
          width={36}
          height={36}
          className="h-9 w-9"
          priority
        />
      </Link>

      <div className="flex-1" />

      <button
        type="button"
        data-search=""
        aria-label="Open Search"
        onClick={open}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground [&_svg]:size-4.5 p-2"
      >
        <Search />
      </button>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Open Sidebar"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground [&_svg]:size-4.5 p-2"
          >
            <PanelLeft />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] max-w-[380px] p-0 text-[0.9375rem] flex flex-col" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <div className="flex flex-col gap-3 p-4 pb-2 shrink-0">
            <div className="flex text-muted-foreground items-center gap-1.5">
              <div className="flex flex-1">
                <a
                  href="https://github.com/ctrotech-tutor/ctrodb"
                  rel="noreferrer noopener"
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground [&_svg]:size-4.5 p-2"
                  aria-label="github"
                  data-active="false"
                >
                  <svg role="img" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12" />
                  </svg>
                </a>
              </div>
              <ThemeToggle />
              <SheetClose asChild>
                <button
                  aria-label="Close Sidebar"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground [&_svg]:size-4.5 p-2"
                >
                  <PanelLeft />
                </button>
              </SheetClose>
            </div>
          </div>
          <MobileSidebar groups={groups} onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  )
}
