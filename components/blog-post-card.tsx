import Link from "next/link"
import { Clock } from "lucide-react"
import type { PostMeta } from "@/lib/posts"
import { estimateReadingTime } from "@/lib/reading-time"

export function BlogPostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative rounded-xl border bg-card p-5 transition-all hover:shadow-sm">
      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
        {post.category}
      </span>
      <Link href={`/blog/${post.slug}`} className="mt-3 block">
        <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {post.description}
        </p>
      </Link>
      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        <time dateTime={post.date}>{post.date}</time>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3" />
          {estimateReadingTime(post.title + " " + post.description)} min read
        </span>
      </div>
    </article>
  )
}
