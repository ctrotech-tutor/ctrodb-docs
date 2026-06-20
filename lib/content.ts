import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import matter from "gray-matter"
import { compile, type MDXResult } from "./mdx"
import { estimateReadingTime } from "./reading-time"

export type DocFrontmatter = {
  title: string
  description: string
}

export type DocResult = MDXResult & {
  frontmatter: DocFrontmatter
  prev: { title: string; slug: string } | null
  next: { title: string; slug: string } | null
  lastUpdated: string
  raw: string
}

function getGitDate(filePath: string): string {
  try {
    const relPath = path.relative(process.cwd(), filePath)
    const out = execSync(`git log -1 --format="%ai" -- "${relPath}"`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
      timeout: 5000,
    }).trim()
    if (out) {
      const d = new Date(out)
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  } catch {}

  const stat = fs.statSync(filePath)
  return stat.mtime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getAdjacentPages(slug: string[]) {
  const metaPath = path.join(process.cwd(), "content/docs/meta.json")
  if (!fs.existsSync(metaPath)) return { prev: null, next: null }

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"))
  const pages = meta.pages as string[]
  const current = slug.join("/")
  const idx = pages.indexOf(current)

  if (idx === -1) return { prev: null, next: null }

  const prevSlug = idx > 0 ? pages[idx - 1] : null
  const nextSlug = idx < pages.length - 1 ? pages[idx + 1] : null

  const getTitle = (s: string) => {
    const fp = path.join(process.cwd(), `content/docs/${s}.mdx`)
    try {
      const src = fs.readFileSync(fp, "utf8")
      const { data } = matter(src)
      return (data.title as string) || s.split("/").pop() || s
    } catch {
      return s.split("/").pop() || s
    }
  }

  return {
    prev: prevSlug ? { title: getTitle(prevSlug), slug: prevSlug } : null,
    next: nextSlug ? { title: getTitle(nextSlug), slug: nextSlug } : null,
  }
}

export async function getDoc(slug: string[]): Promise<DocResult | null> {
  const filePath = path.join(process.cwd(), "content/docs", ...slug) + ".mdx"

  if (!fs.existsSync(filePath)) {
    return null
  }

  const source = fs.readFileSync(filePath, "utf8")
  const { content: body, data } = matter(source)
  const { content, toc } = await compile(body)

  const { prev, next } = getAdjacentPages(slug)
  const lastUpdated = getGitDate(filePath)

  return {
    content,
    toc,
    frontmatter: {
      title: data.title as string,
      description: data.description as string,
    },
    prev,
    next,
    lastUpdated,
    raw: source,
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
  readingTime: number
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
    readingTime: estimateReadingTime(body),
    frontmatter: {
      title: (data.title as string) || slug,
      description: (data.description as string) || "",
      date: (data.date as string) || "",
      author: (data.author as string) || "ctrodb team",
      tags: (data.tags as string[]) || [],
    },
  }
}
