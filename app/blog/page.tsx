import Link from "next/link"
import { getAllPosts } from "@/lib/posts"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Blog",
  description: "Thoughts on building ctrodb, client-side databases, and TypeScript.",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          Thoughts on building ctrodb, client-side databases, and TypeScript.
        </p>
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group -mx-4 rounded-xl p-4 transition-colors hover:bg-muted"
            >
              <article>
                <time className="text-sm text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="mt-1 text-xl font-semibold group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{post.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
