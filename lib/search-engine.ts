import MiniSearch from "minisearch"
import { getSearchIndex, type SearchResult } from "./search-index"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MiniSearchResult = Record<string, any>

const ENGINE_OPTIONS = {
  fields: ["title", "section", "content", "category"],
  storeFields: [
    "id", "hash", "slug", "title", "description",
    "section", "content", "type", "category",
    "tags", "date", "author",
  ],
  searchOptions: {
    boost: { title: 5, section: 3, content: 1 },
    fuzzy: 0.2,
    prefix: true,
  },
}

let engine: MiniSearch | null = null
let enginePromise: Promise<MiniSearch> | null = null

export async function getSearchEngine(): Promise<MiniSearch> {
  if (engine) return engine
  if (enginePromise) return enginePromise
  enginePromise = (async () => {
    const data = await getSearchIndex()
    const ms = new MiniSearch(ENGINE_OPTIONS)
    ms.addAll(data)
    engine = ms
    return ms
  })()
  return enginePromise
}

export function searchDocs(
  results: MiniSearchResult[],
  filter?: "all" | "docs" | "blog",
  limit = 20,
): SearchResult[] {
  let filtered = results as unknown as SearchResult[]
  if (filter === "docs") filtered = filtered.filter((r) => r.type === "docs")
  if (filter === "blog") filtered = filtered.filter((r) => r.type === "blog")
  return filtered.slice(0, limit)
}

export { ENGINE_OPTIONS }
