import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 — Not Found",
}

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-32 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">
        This page does not exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go home
      </Link>
    </main>
  )
}
