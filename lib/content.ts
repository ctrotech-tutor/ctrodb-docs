import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { compile, type MDXResult } from "./mdx"

export type DocFrontmatter = {
  title: string
  description: string
}

export type DocResult = MDXResult & {
  frontmatter: DocFrontmatter
}

export async function getDoc(slug: string[]): Promise<DocResult | null> {
  const filePath = path.join(process.cwd(), "content/docs", ...slug) + ".mdx"

  if (!fs.existsSync(filePath)) {
    return null
  }

  const source = fs.readFileSync(filePath, "utf8")
  const { content: body, data } = matter(source)
  const { content, toc } = await compile(body)

  return {
    content,
    toc,
    frontmatter: {
      title: data.title as string,
      description: data.description as string,
    },
  }
}

export function getAllDocSlugs(): string[][] {
  const metaPath = path.join(process.cwd(), "content/docs/meta.json")
  if (!fs.existsSync(metaPath)) return []

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"))
  return (meta.pages as string[]).map((p: string) => p.split("/"))
}

export type BlogFrontmatter = {
  title: string
  description: string
  date: string
  author: string
  tags: string[]
}

export type BlogResult = MDXResult & {
  frontmatter: BlogFrontmatter
}

export async function getBlogPost(slug: string): Promise<BlogResult | null> {
  const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const source = fs.readFileSync(filePath, "utf8")
  const { content: body, data } = matter(source)
  const { content, toc } = await compile(body)

  return {
    content,
    toc,
    frontmatter: {
      title: (data.title as string) || slug,
      description: (data.description as string) || "",
      date: (data.date as string) || "",
      author: (data.author as string) || "ctrodb team",
      tags: (data.tags as string[]) || [],
    },
  }
}
