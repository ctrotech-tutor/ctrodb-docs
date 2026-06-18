import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type PostMeta = {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
}

export function getAllPosts(): PostMeta[] {
  const blogDir = path.join(process.cwd(), "content/blog")
  if (!fs.existsSync(blogDir)) return []

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"))

  const posts: PostMeta[] = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "")
    const source = fs.readFileSync(path.join(blogDir, file), "utf8")
    const { data } = matter(source)

    return {
      slug,
      title: (data.title as string) || slug,
      description: (data.description as string) || "",
      date: (data.date as string) || "",
      author: (data.author as string) || "ctrodb team",
      tags: (data.tags as string[]) || [],
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): PostMeta | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}
