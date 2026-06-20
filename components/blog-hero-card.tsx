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

export function BlogHeroCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg"
    >
      <div className="p-8 md:p-10">
        <Badge variant="secondary" className="mb-4 text-xs">
          {post.category}
        </Badge>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{post.description}</p>
        <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary shrink-0">
              {getInitials(post.author)}
            </div>
          <div>
            <div className="font-medium text-foreground">{post.author}</div>
            <div>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {post.readingTime} min read
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}
