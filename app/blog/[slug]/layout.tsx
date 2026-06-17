import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>
      <div className="prose prose-zinc max-w-none dark:prose-invert
        prose-headings:scroll-mt-20
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
        prose-pre:border prose-pre:border-border prose-pre:bg-muted
        prose-img:rounded-xl
        prose-blockquote:border-primary
        prose-strong:text-foreground
        prose-hr:border-border
      ">
        {children}
      </div>
    </article>
  )
}
