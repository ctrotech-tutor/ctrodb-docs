import Link from "next/link"
import { ArrowUpRight, Clock } from "lucide-react"
import type { PostMeta } from "@/lib/posts"
import { estimateReadingTime } from "@/lib/reading-time"

export function BlogHeroCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block overflow-hidden rounded-xl border bg-gradient-to-br from-card to-muted/50 p-6 transition-all hover:shadow-md sm:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {post.category}
          </span>
          <h2 className="mt-3 text-xl font-semibold tracking-tight group-hover:text-primary transition-colors sm:text-2xl">
            {post.title}
          </h2>
          <p className="mt-2 text-muted-foreground line-clamp-2">
            {post.description}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={post.date}>{post.date}</time>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {estimateReadingTime(post.title + " " + post.description)} min read
            </span>
          </div>
        </div>
        <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  )
}
