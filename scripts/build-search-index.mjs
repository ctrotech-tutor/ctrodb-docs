import fs from "fs"
import path from "path"
import matter from "gray-matter"

const ROOT = process.cwd()
const DOCS_DIR = path.join(ROOT, "content/docs")
const BLOG_DIR = path.join(ROOT, "content/blog")
const OUTPUT = path.join(ROOT, "public/search-index.json")

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function stripMarkdown(mdx) {
  return mdx
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\{:[\w-]+\}/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/^#{2,3}\s+/gm, "")
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    .replace(/^---$/gm, "")
    .replace(/^>\s*/gm, "")
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function splitIntoSections(content) {
  const lines = content.split("\n")
  const sections = []
  let currentHeading = ""
  let currentBody = []
  let hasContent = false

  for (const line of lines) {
    const headingMatch = line.match(/^(#{2,3})\s+(.+)/)
    if (headingMatch) {
      if (currentBody.length > 0 || hasContent) {
        sections.push({
          heading: currentHeading,
          body: currentBody.join("\n"),
        })
      }
      currentHeading = headingMatch[2].trim()
      currentBody = []
      hasContent = false
    } else {
      if (line.trim()) hasContent = true
      currentBody.push(line)
    }
  }

  if (currentBody.length > 0) {
    sections.push({
      heading: currentHeading,
      body: currentBody.join("\n"),
    })
  }

  if (sections.length === 0 && currentBody.length > 0) {
    sections.push({ heading: "", body: currentBody.join("\n") })
  }

  return sections
}

let entryCounter = 0

function nextId() {
  return `search-entry-${entryCounter++}`
}

function processDocFile(filePath, slugParts) {
  const slug = slugParts.join("/")
  const source = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(source)
  const title = data.title || slug.split("/").pop() || slug
  const description = data.description || ""

  const sections = splitIntoSections(content)
  const entries = []

  for (const [i, section] of sections.entries()) {
    const plainText = stripMarkdown(section.body)
    if (!plainText) continue

    const sectionSlug = section.heading ? slugify(section.heading) : ""
    const hash = sectionSlug || (i === 0 ? "" : `section-${i}`)

    entries.push({
      id: nextId(),
      hash,
      slug: `/docs/${slug}`,
      title,
      description,
      section: section.heading || description,
      content: plainText,
      type: "docs",
      category: slugParts[0] || "",
    })
  }

  if (entries.length === 0) {
    entries.push({
      id: nextId(),
      hash: "",
      slug: `/docs/${slug}`,
      title,
      description,
      section: description,
      content: title,
      type: "docs",
      category: slugParts[0] || "",
    })
  }

  return entries
}

function processBlogFile(filePath, slug) {
  const source = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(source)
  const title = data.title || slug
  const description = data.description || ""

  const sections = splitIntoSections(content)
  const entries = []

  for (const [i, section] of sections.entries()) {
    const plainText = stripMarkdown(section.body)
    if (!plainText) continue

    const sectionSlug = section.heading ? slugify(section.heading) : ""
    const hash = sectionSlug || (i === 0 ? "" : `section-${i}`)

    entries.push({
      id: nextId(),
      hash,
      slug: `/blog/${slug}`,
      title,
      description,
      section: section.heading || description,
      content: plainText,
      type: "blog",
      category: "blog",
      tags: data.tags || [],
      date: data.date || "",
      author: data.author || "",
    })
  }

  if (entries.length === 0) {
    entries.push({
      id: nextId(),
      hash: "",
      slug: `/blog/${slug}`,
      title,
      description,
      section: description,
      content: title,
      type: "blog",
      category: "blog",
      tags: data.tags || [],
      date: data.date || "",
      author: data.author || "",
    })
  }

  return entries
}

function main() {
  const allEntries = []
  let docCount = 0

  // Process docs using meta.json for ordering
  const metaPath = path.join(DOCS_DIR, "meta.json")
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"))
    const pages = meta.pages || []
    docCount = pages.length

    for (const pagePath of pages) {
      const filePath = path.join(DOCS_DIR, `${pagePath}.mdx`)
      if (fs.existsSync(filePath)) {
        const entries = processDocFile(filePath, pagePath.split("/"))
        allEntries.push(...entries)
      } else {
        console.warn(`[search] Missing doc: ${pagePath}`)
      }
    }
  }

  // Process blog posts
  let blogCount = 0
  if (fs.existsSync(BLOG_DIR)) {
    const blogFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"))
    blogCount = blogFiles.length
    for (const file of blogFiles) {
      const slug = file.replace(/\.mdx$/, "")
      const filePath = path.join(BLOG_DIR, file)
      const entries = processBlogFile(filePath, slug)
      allEntries.push(...entries)
    }
  }

  // Write output
  const json = JSON.stringify(allEntries)
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
  fs.writeFileSync(OUTPUT, json, "utf8")

  console.log(`[search] Index written: ${OUTPUT}`)
  console.log(`[search] ${allEntries.length} entries from ${docCount} docs + ${blogCount} blog posts`)
}

main()
