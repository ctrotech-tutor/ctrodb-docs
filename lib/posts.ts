import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { estimateReadingTime } from "./reading-time"

export type PostMeta = {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  category: string
  readingTime: number
}

export type PostCategory = string

export function getAllPosts(): PostMeta[] {
  const blogDir = path.join(process.cwd(), "content/blog")
  if (!fs.existsSync(blogDir)) return []

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"))

  const posts: PostMeta[] = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "")
    const source = fs.readFileSync(path.join(blogDir, file), "utf8")
    const { data, content } = matter(source)

    return {
      slug,
      title: (data.title as string) || slug,
      description: (data.description as string) || "",
      date: (data.date as string) || "",
      author: (data.author as string) || "ctrodb team",
      tags: (data.tags as string[]) || [],
      category: (data.category as string) || "General",
      readingTime: estimateReadingTime(content),
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): PostMeta | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export function getAllCategories(posts: PostMeta[]): PostCategory[] {
  const cats = new Set(posts.map((p) => p.category))
  return Array.from(cats).sort()
}
