"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

const emptySubscribe = () => () => {}

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,   // client snapshot: always mounted
    () => false   // server snapshot: never mounted
  )
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      className="inline-flex items-center border overflow-hidden px-1 py-0 border-y-0 border-e-0 rounded-none ms-auto *:rounded-md"
      aria-label="Toggle Theme"
      data-theme-toggle=""
      onClick={() => setTheme(isDark ? "light" : "dark")}
      suppressHydrationWarning
    >
      <Sun
        className={`size-6.5 p-1.5 ${
          mounted && !isDark
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground"
        }`}
      />

      <Moon
        className={`size-6.5 p-1.5 ${
          isDark
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground"
        }`}
      />
    </button>
  )
}