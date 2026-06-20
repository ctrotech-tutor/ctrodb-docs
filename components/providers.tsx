"use client"

import { ThemeProvider } from "next-themes"
import { SearchProvider } from "@/lib/search-context"
import { AiProvider } from "@/lib/ai-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SearchProvider>
        <AiProvider>
          {children}
        </AiProvider>
      </SearchProvider>
    </ThemeProvider>
  )
}
