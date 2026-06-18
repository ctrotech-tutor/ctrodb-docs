import { getDoc, getAllDocSlugs } from "@/lib/content"
import { notFound } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { TableOfContents } from "@/components/toc"
import Link from "next/link"

export default async function DocPage(props: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await props.params
  const result = await getDoc(slug || ["getting-started", "installation"])
  if (!result) notFound()

  const { content, frontmatter, toc } = result

  const breadcrumbs = slug
    ? slug.map((part, i) => ({
        label: part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        href: "/docs/" + slug.slice(0, i + 1).join("/"),
        current: i === slug.length - 1,
      }))
    : []

  return (
    <div className="mx-auto flex max-w-[90rem]">
      <article className="min-w-0 flex-1 px-6 py-10 sm:px-10 lg:px-16">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/docs/getting-started/installation">Docs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {breadcrumbs.map((crumb, i) => (
            <BreadcrumbItem key={crumb.href}>
              {crumb.current ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">{frontmatter.title}</h1>
        {frontmatter.description && (
          <p className="mb-8 text-lg text-muted-foreground">{frontmatter.description}</p>
        )}

        <div className="prose prose-zinc max-w-none dark:prose-invert">
          {content}
        </div>
      </article>

      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="sticky top-20 px-4 py-10">
          <TableOfContents items={toc} />
        </div>
      </aside>
    </div>
  )
}

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({
    slug,
  }))
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await props.params
  const result = await getDoc(slug || ["getting-started", "installation"])
  if (!result) return undefined

  const { title, description } = result.frontmatter

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ctrodb`,
      description,
      type: "article",
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
