import { getBlogPost } from "@/lib/content"
import { getAllPosts } from "@/lib/posts"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BlogTOC } from "@/components/blog-toc"
import { TocPopover } from "@/components/toc-popover"
import { BlogShare } from "@/components/blog-share"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const result = await getBlogPost(slug)
  if (!result) notFound()

  const { content, frontmatter, toc, readingTime } = result

  const posts = getAllPosts()
  const currentIndex = posts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

  // Related posts: same category, excluding current
  const related = posts
    .filter((p) => p.slug !== slug && p.category === frontmatter.tags[0])
    .slice(0, 3)
  // Fallback to most recent if not enough related
  const relatedPosts = related.length >= 2
    ? related
    : posts.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <>
      <Navbar />
      <TocPopover items={toc} />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto flex max-w-[90rem] justify-center gap-12 items-start">
          {/* Main content */}
          <article className="min-w-0 max-w-3xl flex-1">
            {/* Back link */}
            <Link
              href="/blog"
              className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to blog
            </Link>

            {/* Header */}
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

              {/* Author + meta row */}
              <div className="mt-6 flex items-center gap-3 border-b pb-6">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary shrink-0">
                  {getInitials(frontmatter.author)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{frontmatter.author}</div>
                  <div className="text-xs text-muted-foreground">
                    <time dateTime={frontmatter.date}>
                      {new Date(frontmatter.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {" · "}
                    {readingTime} min read
                  </div>
                </div>
                <BlogShare slug={slug} />
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-zinc max-w-none dark:prose-invert
              prose-headings:scroll-mt-24
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
              prose-pre:border prose-pre:border-border prose-pre:bg-muted
              prose-img:rounded-xl
              prose-blockquote:border-primary
              prose-strong:text-foreground
              prose-hr:border-border
            ">
              {content}
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <>
                <Separator className="my-12" />
                <section>
                  <h2 className="mb-6 text-xl font-semibold">Related posts</h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {relatedPosts.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        className="group rounded-lg border p-4 transition-colors hover:bg-muted"
                      >
                        <Badge variant="secondary" className="mb-2 text-[10px]">
                          {p.category}
                        </Badge>
                        <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                          {p.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {p.description}
                        </p>
                        <time className="mt-2 block text-[10px] text-muted-foreground">
                          {new Date(p.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </Link>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Prev / Next */}
            {(prevPost || nextPost) && (
              <>
                <Separator className="my-12" />
                <nav className="flex items-center justify-between gap-4">
                  {prevPost ? (
                    <Link
                      href={`/blog/${prevPost.slug}`}
                      className="group flex-1 rounded-lg border p-4 transition-colors hover:bg-muted"
                    >
                      <span className="text-xs text-muted-foreground">Previous</span>
                      <p className="mt-1 text-sm font-medium group-hover:text-primary">
                        {prevPost.title}
                      </p>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}
                  {nextPost ? (
                    <Link
                      href={`/blog/${nextPost.slug}`}
                      className="group flex-1 rounded-lg border p-4 text-right transition-colors hover:bg-muted"
                    >
                      <span className="text-xs text-muted-foreground">Next</span>
                      <p className="mt-1 flex items-center justify-end gap-1 text-sm font-medium group-hover:text-primary">
                        {nextPost.title}
                        <ArrowRight className="size-3.5" />
                      </p>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}
                </nav>
              </>
            )}
          </article>

          {/* Desktop TOC */}
          <BlogTOC items={toc} />
        </div>
      </main>
      <Footer />
    </>
  )
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const result = await getBlogPost(slug)
  if (!result) return undefined
  const { title, description, date, author } = result.frontmatter
  return {
    title: `${title} | ctrodb`,
    description,
    openGraph: {
      title: `${title} | ctrodb`,
      description,
      type: "article",
      publishedTime: date,
      authors: [author],
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
