import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { PostMeta } from "@/lib/posts"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function BlogPostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group -mx-4 rounded-xl p-4 transition-colors hover:bg-muted"
    >
      <article>
        <Badge variant="secondary" className="mb-3 text-xs">
          {post.category}
        </Badge>
        <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
          {post.description}
        </p>
        <div className="mt-4 flex items-center gap-2.5 text-xs text-muted-foreground">
          <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary shrink-0">
            {getInitials(post.author)}
          </div>
          <span>{post.author}</span>
          <span aria-hidden="true">·</span>
          <time>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </article>
    </Link>
  )
}
