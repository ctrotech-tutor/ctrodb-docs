import { getDoc, getAllDocSlugs } from "@/lib/content"
import { isValidVersion, getDefaultVersion } from "@/lib/versions"
import { notFound, permanentRedirect } from "next/navigation"
import Link from "next/link"
import { TableOfContents } from "@/components/toc"
import { TocPopover } from "@/components/toc-popover"
import { CopyMarkdown } from "@/components/copy-markdown"
import { OpenDropdown } from "@/components/open-dropdown"
import { DocShare } from "@/components/doc-share"
import { DocNav } from "@/components/doc-nav"
import { DocFeedback } from "@/components/feedback"
import { CodeCopyProvider } from "@/components/code-copy"
import { ChevronRight, ExternalLink } from "lucide-react"

function getBreadcrumbs(version: string, slug: string[]): { label: string; href: string }[] {
  const groups: Record<string, string> = {
    "getting-started": "Getting Started",
    "core-concepts": "Core Concepts",
    adapters: "Adapters",
    plugins: "Plugins",
    sync: "Sync",
    react: "React",
    "api-reference": "API Reference",
    examples: "Examples",
    migration: "Migration",
  }

  const crumbs: { label: string; href: string }[] = [
    { label: "Docs", href: `/docs/${version}` },
  ]

  if (slug.length > 0 && groups[slug[0]]) {
    crumbs.push({ label: groups[slug[0]], href: `/docs/${version}/${slug[0]}` })
  }

  return crumbs
}

export default async function DocPage(props: {
  params: Promise<{ version: string; slug?: string[] }>
}) {
  const { version, slug } = await props.params

  if (!isValidVersion(version)) {
    const defaultVer = getDefaultVersion()
    const target = slug ? `/docs/${defaultVer}/${slug.join("/")}` : `/docs/${defaultVer}`
    permanentRedirect(target)
  }

  const docSlug = slug || ["getting-started", "installation"]
  const result = await getDoc(version, docSlug)
  if (!result) notFound()

  const { content, frontmatter, toc, prev, next, lastUpdated, raw } = result

  return (
    <>
      <TocPopover items={toc} activeId="" />
      <div className="mx-auto flex max-w-[90rem]">
        <article
          id="nd-page"
          className="flex flex-col w-full max-w-[900px] mx-auto [grid-area:main] px-4 py-6 gap-4 md:px-6 md:pt-8 xl:px-8 xl:pt-14"
        >
          <h1 className="text-[1.75em] font-semibold">{frontmatter.title}</h1>
          {frontmatter.description && (
            <p className="text-lg text-muted-foreground mb-2">{frontmatter.description}</p>
          )}

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              {getBreadcrumbs(version, docSlug).map((crumb, i, arr) => (
                <li key={crumb.href} className="inline-flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="size-3.5" />}
                  {i < arr.length - 1 ? (
                    <Link href={crumb.href} className="hover:text-foreground transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-row flex-wrap gap-2 items-center border-b pb-6">
            <CopyMarkdown raw={raw} />
            <OpenDropdown version={version} slug={docSlug.join("/")} />
            <DocShare version={version} slug={docSlug.join("/")} title={frontmatter.title} description={frontmatter.description} />
          </div>

          <CodeCopyProvider>
            <div className="prose flex-1 text-foreground/90 max-w-none dark:prose-invert prose-headings:scroll-mt-28 prose-headings:group/heading prose-a:no-underline hover:prose-a:underline">
              {content}
            </div>
          </CodeCopyProvider>

          <div className="flex items-center justify-between border-y py-3">
            <DocFeedback slug={`${version}/${docSlug.join("/")}`} title={frontmatter.title} />
            <a
              href={`https://github.com/ctrotech-tutor/ctrodb-docs/blob/main/content/${version}/docs/${docSlug.join("/")}.mdx`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="size-3" />
              Edit on GitHub
            </a>
          </div>

          <p className="text-sm text-muted-foreground">Last updated on {lastUpdated}</p>

          <DocNav prev={prev} next={next} />
        </article>

        <aside className="hidden xl:block">
          <TableOfContents items={toc} />
        </aside>
      </div>
    </>
  )
}

export function generateStaticParams() {
  const version = "v1"
  const slugs = getAllDocSlugs(version)
  return slugs.map((slug) => ({
    version,
    slug,
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ version: string; slug?: string[] }>
}) {
  const { version, slug } = await props.params
  const docSlug = slug || ["getting-started", "installation"]
  const result = await getDoc(version, docSlug)
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
