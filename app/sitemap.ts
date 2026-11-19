import fs from "node:fs"
import path from "node:path"
import type { MetadataRoute } from "next"
import { getAllDocSlugs } from "@/lib/content"
import { getAllPosts } from "@/lib/posts"
import { getDefaultVersion } from "@/lib/versions"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://ctrodb.vercel.app"
  const defaultVer = getDefaultVersion()

  const docsSlugs = getAllDocSlugs()
  const docsPages = docsSlugs.map((slug) => ({
    urlPath: `/docs/${defaultVer}/${slug.join("/")}`,
    filePath: path.join(process.cwd(), "content", defaultVer, "docs", `${slug.join("/")}.mdx`),
  }))

  const blogPosts = getAllPosts()
  const blogPages = blogPosts.map((post) => ({
    urlPath: `/blog/${post.slug}`,
    filePath: path.join(process.cwd(), "content", "blog", `${post.slug}.mdx`),
  }))

  const allPages = [
    { urlPath: "", filePath: path.join(process.cwd(), "app", "page.tsx") },
    ...docsPages,
    ...blogPages,
  ]

  return allPages.map(({ urlPath, filePath }) => ({
    url: `${siteUrl}${urlPath}`,
    lastModified: fs.statSync(filePath).mtime,
    changeFrequency: urlPath.startsWith("/blog") ? "monthly" : "weekly" as const,
    priority: urlPath === "" ? 1 : 0.8,
  }))
}
