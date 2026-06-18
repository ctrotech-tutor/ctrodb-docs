import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type SidebarItem = {
  title: string
  slug: string
}

export type SidebarGroup = {
  title: string
  items: SidebarItem[]
}

export function getSidebar(): SidebarGroup[] {
  const metaPath = path.join(process.cwd(), "content/docs/meta.json")
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"))

  const groupMap = new Map<string, SidebarItem[]>()

  for (const pagePath of meta.pages as string[]) {
    const parts = pagePath.split("/")
    const groupKey = parts.length > 1 ? parts[0] : "__root__"
    const filePath = path.join(process.cwd(), `content/docs/${pagePath}.mdx`)
    const source = fs.readFileSync(filePath, "utf8")
    const { data } = matter(source)
    const title = (data.title as string) || parts[parts.length - 1]

    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, [])
    }
    groupMap.get(groupKey)!.push({ title, slug: pagePath })
  }

  const displayNames: Record<string, string> = {
    "getting-started": "Getting Started",
    "core-concepts": "Core Concepts",
    adapters: "Adapters",
    plugins: "Plugins",
    react: "React",
    "api-reference": "API Reference",
    examples: "Examples",
    migration: "Migration",
    "__root__": "Other",
  }

  const groups: SidebarGroup[] = []
  for (const [key, items] of groupMap) {
    if (key === "__root__") {
      for (const item of items) {
        groups.push({ title: item.title, items: [item] })
      }
    } else {
      groups.push({
        title: displayNames[key] || key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        items,
      })
    }
  }

  return groups
}
