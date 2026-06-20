import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

type NavPage = {
  title: string
  slug: string
}

export function DocNav({
  prev,
  next,
}: {
  prev: NavPage | null
  next: NavPage | null
}) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Page navigation"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="
            group relative flex flex-col gap-1.5 overflow-hidden
            rounded-xl border border-border/70 bg-card/40 p-4
            text-sm transition-all duration-200
            hover:border-border hover:bg-accent/40
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-ring focus-visible:ring-offset-2
            focus-visible:ring-offset-background
          "
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <ChevronLeft className="size-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Previous
          </span>

          <span className="truncate font-medium text-foreground">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden="true" />
      )}

      {next && (
        <Link
          href={`/docs/${next.slug}`}
          className="
            group relative flex flex-col gap-1.5 overflow-hidden
            rounded-xl border border-border/70 bg-card/40 p-4
            text-end text-sm transition-all duration-200
            hover:border-border hover:bg-accent/40
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-ring focus-visible:ring-offset-2
            focus-visible:ring-offset-background
            sm:col-start-2
          "
        >
          <span className="inline-flex items-center justify-end gap-1 text-xs font-medium text-muted-foreground">
            Next
            <ChevronRight className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>

          <span className="truncate font-medium text-foreground">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  )
}