import { getBlogPost } from "@/lib/content"
import { getAllPosts } from "@/lib/posts"
import { getAdjacentPosts } from "@/lib/posts"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { TableOfContents } from "@/components/toc"
import { TocPopover } from "@/components/toc-popover"
import { BlogShare } from "@/components/blog-share"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChevronLeft, ChevronRight, ArrowUpRight, Clock } from "lucide-react"

const baseUrl = "https://ctrodb.vercel.app"

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const result = await getBlogPost(slug)
  if (!result) return {}

  const { title, description, date, author, tags } = result.frontmatter
  const url = `${baseUrl}/blog/${slug}`

  return {
    title: `${title} | ctrodb`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ctrodb`,
      description,
      url,
      type: "article",
      publishedTime: date,
      authors: [author],
      tags,
      siteName: "ctrodb",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ctrodb`,
      description,
    },
  }
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const posts = getAllPosts()
  const meta = posts.find((p) => p.slug === slug)
  if (!meta) notFound()

  const result = await getBlogPost(slug)
  if (!result) notFound()

  const { content, frontmatter, toc, readingTime } = result
  const { prev, next } = getAdjacentPosts(slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    author: {
      "@type": "Person",
      name: frontmatter.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Ctrotech",
    },
    url: `${baseUrl}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
  }

  return (
    <>
      <Navbar />
      <TocPopover items={toc} activeId="" />
      <div className="mx-auto flex max-w-[90rem]">
        <article
          id="nd-page"
          className="flex flex-col w-full max-w-[900px] mx-auto px-4 py-6 gap-4 md:px-6 md:pt-8 xl:px-8 xl:pt-14"
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          {/* Header */}
          <header>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href={frontmatter.category ? `/blog?category=${frontmatter.category}` : "/blog"}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                {frontmatter.category}
              </Link>
              <span aria-hidden="true">·</span>
              <time dateTime={frontmatter.date}>{frontmatter.date}</time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {readingTime} min read
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">{frontmatter.title}</h1>
            {frontmatter.description && (
              <p className="mt-2 text-lg text-muted-foreground">{frontmatter.description}</p>
            )}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{frontmatter.author}</span>
              {frontmatter.tags.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {frontmatter.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Share + RSS */}
          <div className="flex flex-row flex-wrap gap-2 items-center border-b pb-6">
            <BlogShare slug={slug} title={frontmatter.title} description={frontmatter.description} />
            <a
              href="/blog/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowUpRight className="size-3.5" />
              RSS Feed
            </a>
          </div>

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

          {/* Category back link */}
          <div className="border-t pt-6 text-sm text-muted-foreground">
            <Link
              href={frontmatter.category ? `/blog?category=${frontmatter.category}` : "/blog"}
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="size-4" />
              More {frontmatter.category} posts
            </Link>
          </div>

          {/* Prev / Next */}
          {(prev || next) && (
            <nav
              aria-label="Blog post navigation"
              className="grid grid-cols-2 gap-4 border-t pt-6"
            >
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <ChevronLeft className="size-3" />
                    Previous post
                  </span>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group col-start-2 flex flex-col gap-1 rounded-lg border p-4 text-end transition-colors hover:bg-accent"
                >
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground justify-end">
                    Next post
                    <ChevronRight className="size-3" />
                  </span>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          )}
        </article>

        {/* Desktop TOC */}
        <aside className="hidden xl:block">
          <TableOfContents items={toc} />
        </aside>
      </div>
      <Footer />
    </>
  )
}
