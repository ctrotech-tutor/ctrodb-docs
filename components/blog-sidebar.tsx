import Link from "next/link"
import { Tag, FileText } from "lucide-react"
import type { PostMeta } from "@/lib/posts"

export function BlogSidebar({
  categories,
  recentPosts,
  activeCategory,
}: {
  categories: string[]
  recentPosts: PostMeta[]
  activeCategory?: string
}) {
  return (
    <aside className="w-64 shrink-0 max-lg:hidden">
      <div className="sticky top-24 space-y-8">
        {/* Categories */}
        <div>
          <h3 className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Tag className="size-4" />
            Categories
          </h3>
          <nav className="space-y-0.5">
            <Link
              href="/blog"
              className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                !activeCategory
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              All posts
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${cat}`}
                className={`block rounded-lg px-3 py-1.5 text-sm capitalize transition-colors ${
                  activeCategory === cat
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>

        {/* Recent Posts */}
        <div>
          <h3 className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <FileText className="size-4" />
            Recent posts
          </h3>
          <nav className="space-y-2">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-lg px-3 py-1.5 transition-colors hover:bg-accent"
              >
                <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground line-clamp-2">
                  {post.title}
                </span>
                <time className="text-xs text-muted-foreground/60">{post.date}</time>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}
