"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BlogHeroCard } from "@/components/blog-hero-card"
import { BlogPostCard } from "@/components/blog-post-card"
import type { PostMeta } from "@/lib/posts"

export function BlogPageContent({
  allPosts,
  categories,
  initialCategory,
}: {
  allPosts: PostMeta[]
  categories: string[]
  initialCategory: string | null
}) {
  const router = useRouter()
  const [category, setCategory] = useState<string | null>(() => {
    if (typeof window === "undefined") return initialCategory
    const params = new URLSearchParams(window.location.search)
    const cat = params.get("category")
    return cat && categories.includes(cat) ? cat : null
  })

  const filtered = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts
  const [hero, ...rest] = filtered

  function handleFilter(cat: string | null) {
    setCategory(cat)
    const params = new URLSearchParams()
    if (cat) params.set("category", cat)
    const qs = params.toString()
    router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false })
  }

  return (
    <div className="flex gap-12 items-start">
      {/* Desktop sidebar */}
      <aside className="sticky top-24 w-52 shrink-0 max-xl:hidden">
        <h2 className="mb-1 text-lg font-semibold tracking-tight">Blog</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {allPosts.length} posts
        </p>
        <nav className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => handleFilter(null)}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
              !category
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground"
            }`}
          >
            All posts
          </button>
          {categories.map((cat) => {
            const count = allPosts.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleFilter(cat)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
                  category === cat
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {cat}
                <span className="ml-auto text-xs tabular-nums text-muted-foreground/60">
                  {count}
                </span>
              </button>
            )
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 max-w-3xl">
        {/* Mobile category pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 xl:hidden [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:h-0">
          <button
            type="button"
            onClick={() => handleFilter(null)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all whitespace-nowrap ${
              !category
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleFilter(cat)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all whitespace-nowrap ${
                category === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            {category || "All posts"}
          </h1>
          {category && (
            <p className="mt-2 text-lg text-muted-foreground">
              {filtered.length}{" "}
              {filtered.length === 1 ? "post" : "posts"} in {category}
            </p>
          )}
          {!category && (
            <p className="mt-2 text-lg text-muted-foreground">
              Thoughts on building ctrodb, client-side databases, and
              TypeScript.
            </p>
          )}
        </div>

        {hero && (
          <section className="mb-14">
            <BlogHeroCard post={hero} />
          </section>
        )}

        {rest.length > 0 ? (
          <div className="flex flex-col gap-6">
            {rest.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : hero ? null : (
          <p className="py-12 text-center text-muted-foreground">
            No posts found in this category.
          </p>
        )}
      </div>
    </div>
  )
}
