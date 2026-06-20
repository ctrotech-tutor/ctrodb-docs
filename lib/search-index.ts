export type SearchDoc = {
  id: string
  hash: string
  slug: string
  title: string
  description: string
  section: string
  content: string
  type: "docs" | "blog"
  category: string
  tags?: string[]
  date?: string
  author?: string
}

export type SearchResult = SearchDoc & {
  score: number
  terms: string[]
}

export type SearchFilter = "all" | "docs" | "blog"

let cached: SearchDoc[] | null = null
let promise: Promise<SearchDoc[]> | null = null

export function getSearchIndex(): Promise<SearchDoc[]> {
  if (cached) return Promise.resolve(cached)
  if (promise) return promise
  promise = fetch("/search-index.json")
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json() as Promise<SearchDoc[]>
    })
    .then((data) => {
      cached = data
      return data
    })
  return promise
}
