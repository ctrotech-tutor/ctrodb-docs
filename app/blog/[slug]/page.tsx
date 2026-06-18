import { getBlogPost } from "@/lib/content"
import { getAllPosts } from "@/lib/posts"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Separator } from "@/components/ui/separator"

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const result = await getBlogPost(slug)
  if (!result) notFound()

  const { content, frontmatter } = result

  const posts = getAllPosts()
  const currentIndex = posts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to blog
        </Link>

        <article>
          <header className="mb-10">
            <div className="mb-4 flex flex-wrap gap-2">
              {frontmatter.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{frontmatter.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{frontmatter.description}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={frontmatter.date}>
                {new Date(frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden="true">&middot;</span>
              <span>{frontmatter.author}</span>
            </div>
          </header>

          <div className="prose prose-zinc max-w-none dark:prose-invert">
            {content}
          </div>
        </article>

        {(prevPost || nextPost) && (
          <>
            <Separator className="my-12" />
            <nav className="flex items-center justify-between gap-4">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex-1 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                >
                  <span className="text-xs text-muted-foreground">Previous</span>
                  <p className="mt-1 text-sm font-medium group-hover:text-primary">{prevPost.title}</p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex-1 rounded-lg border border-border p-4 text-right transition-colors hover:bg-muted"
                >
                  <span className="text-xs text-muted-foreground">Next</span>
                  <p className="mt-1 text-sm font-medium group-hover:text-primary">{nextPost.title}</p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </nav>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const result = await getBlogPost(slug)
  if (!result) return undefined

  const { title, description } = result.frontmatter

  return {
    title: `${title} | ctrodb`,
    description,
    openGraph: {
      title: `${title} | ctrodb`,
      description,
      type: "article",
      publishedTime: result.frontmatter.date,
      authors: [result.frontmatter.author],
      images: [
        {
          url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description || "")}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ctrodb`,
      description,
    },
  }
}
