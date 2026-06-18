export type TOCItem = {
  level: number
  text: string
  id: string
}

export function extractTOC(mdx: string): TOCItem[] {
  const regex = /^(#{2,3})\s+(.+)$/gm
  const items: TOCItem[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(mdx)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
    items.push({ level, text, id })
  }

  return items
}
