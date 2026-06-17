import { getPage, getPages } from "@/lib/source"
import { DocsPage, DocsBody } from "fumadocs-ui/page"
import { notFound } from "next/navigation"

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await props.params
  const page = getPage(slug)
  if (!page) notFound()

  const Content = page.data.body

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{ enabled: true }}
      tableOfContentPopover={{ enabled: true }}
      breadcrumb={{ enabled: true, includePage: true }}
      footer={{ enabled: true }}
    >
      <DocsBody>
        <Content />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return getPages().map((page) => ({
    slug: page.slugs,
  }))
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await props.params
  const page = getPage(slug)
  if (!page) return undefined

  const title = page.data.title
  const description = page.data.description

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
