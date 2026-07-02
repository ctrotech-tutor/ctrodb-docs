import type { MetadataRoute } from "next"
import { getAllDocSlugs } from "@/lib/content"
import { getAllPosts } from "@/lib/posts"
import { getDefaultVersion } from "@/lib/versions"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://ctrodb.vercel.app"
  const defaultVer = getDefaultVersion()

  const docsSlugs = getAllDocSlugs()
  const docsPages = docsSlugs.map((slug) => `/docs/${defaultVer}/${slug.join("/")}`)

  const blogPosts = getAllPosts()
  const blogPages = blogPosts.map((post) => `/blog/${post.slug}`)

  const allPages = ["", ...docsPages, ...blogPages]

  return allPages.map((page) => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page.startsWith("/blog") ? "monthly" : "weekly" as const,
    priority: page === "" ? 1 : 0.8,
  }))
}
