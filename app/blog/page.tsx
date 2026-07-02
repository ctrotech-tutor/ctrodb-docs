import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import type { Metadata } from "next"
import { getAllPosts, getAllCategories } from "@/lib/posts"
import { BlogHeroCard } from "@/components/blog-hero-card"
import { BlogPostCard } from "@/components/blog-post-card"
import { BlogSidebar } from "@/components/blog-sidebar"
import { Rss } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on building ctrodb, client-side databases, and TypeScript.",
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const allPosts = getAllPosts()
  const categories = getAllCategories(allPosts)
  const filtered = category ? allPosts.filter((p) => p.category === category) : allPosts

  return (
    <>
      <Navbar />
      <div className="mx-auto flex max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8">
        <BlogSidebar categories={categories} recentPosts={allPosts.slice(0, 5)} activeCategory={category} />

        <main className="min-w-0 flex-1">
          <div className="max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
                <p className="mt-2 text-muted-foreground">
                  {category ? `Posts in "${category}"` : "Thoughts on building ctrodb, client-side databases, and TypeScript."}
                </p>
              </div>
              <Link
                href="/blog/rss.xml"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Rss className="size-4" />
                <span className="hidden sm:inline">RSS</span>
              </Link>
            </div>

            {filtered.length === 0 && (
              <p className="mt-10 text-muted-foreground">No posts found in this category.</p>
            )}

            {filtered.length > 0 && (
              <div className="mt-8 space-y-8">
                {!category && (
                  <BlogHeroCard post={filtered[0]} />
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  {(category ? filtered : filtered.slice(1)).map((post) => (
                    <BlogPostCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
