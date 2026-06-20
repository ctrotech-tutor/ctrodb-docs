"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Search, FileText, File, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSearchEngine, searchDocs } from "@/lib/search-engine"
import type { SearchResult, SearchFilter } from "@/lib/search-index"

type SearchContext = {
  open: () => void
}

const SearchCtx = createContext<SearchContext>({ open: () => {} })
const FILTERS: { value: SearchFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "docs", label: "Docs" },
  { value: "blog", label: "Blog" },
]

export function useSearch() {
  return useContext(SearchCtx)
}

function highlightText(text: string, terms: string[]): string {
  if (!terms.length) return escapeHtml(text)
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  const regex = new RegExp(`(${escaped.join("|")})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function getExcerpt(content: string, terms: string[], maxLen = 120): string {
  if (!terms.length) return content.slice(0, maxLen)
  const lower = content.toLowerCase()
  let bestIdx = -1
  for (const term of terms) {
    const idx = lower.indexOf(term.toLowerCase())
    if (idx !== -1 && (bestIdx === -1 || idx < bestIdx)) bestIdx = idx
  }
  if (bestIdx === -1) return content.slice(0, maxLen)
  const start = Math.max(0, bestIdx - 40)
  const end = Math.min(content.length, bestIdx + maxLen - 40)
  let excerpt = content.slice(start, end)
  if (start > 0) excerpt = "…" + excerpt
  if (end < content.length) excerpt = excerpt + "…"
  return excerpt
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [filter, setFilter] = useState<SearchFilter>("all")
  const [activeIndex, setActiveIndex] = useState(-1)
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const engineLoadedRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const loading = isOpen && !loaded && !loadError

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setQuery("")
    setResults([])
    setActiveIndex(-1)
    setLoadError(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        handleOpen()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [handleOpen])

  // Load search index when dialog opens
  useEffect(() => {
    if (!isOpen || loaded || loadError || engineLoadedRef.current) return

    getSearchEngine()
      .then(() => {
        engineLoadedRef.current = true
        setLoaded(true)
      })
      .catch((err) => {
        console.error("Search index load failed:", err)
        setLoadError("Failed to load search index")
      })
  }, [isOpen, loaded, loadError])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!engineLoadedRef.current || !query.trim()) {
      setResults([])
      setActiveIndex(-1)
      return
    }
    debounceRef.current = setTimeout(async () => {
      const ms = await getSearchEngine()
      const raw = ms.search(query, {
        boost: { title: 5, section: 3, content: 1 },
        fuzzy: 0.2,
        prefix: true,
      })
      const filtered = searchDocs(raw, filter, 20)
      setResults(filtered)
      setActiveIndex(-1)
    }, 150)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, filter])

  // Scroll active result into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const el = listRef.current.children[activeIndex] as HTMLElement | undefined
    el?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  const navigateTo = useCallback(
    (result: SearchResult) => {
      const hash = result.hash ? `#${result.hash}` : ""
      window.location.href = result.slug + hash
      setIsOpen(false)
    },
    [],
  )

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex >= 0 && results[activeIndex]) {
        navigateTo(results[activeIndex])
      }
    }
  }

  function cycleFilter() {
    setFilter((f) => (f === "all" ? "docs" : f === "docs" ? "blog" : "all"))
  }

  function renderResult(result: SearchResult, i: number) {
    const isActive = i === activeIndex
    const excerpt = getExcerpt(result.content, result.terms || [])
    const hash = result.hash ? `#${result.hash}` : ""

    return (
      <a
        key={result.id}
        href={result.slug + hash}
        data-active={isActive ? "true" : "false"}
        className={cn(
          "flex items-start gap-3 rounded-lg p-2.5 transition-colors scroll-m-2",
          "data-[active=true]:bg-accent",
        )}
        onClick={() => setIsOpen(false)}
      >
        {result.type === "blog" ? (
          <File className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
        ) : (
          <FileText className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium truncate">{result.title}</span>
            {result.section && result.section !== result.description && (
              <span className="text-xs text-muted-foreground truncate">{result.section}</span>
            )}
          </div>
          <p
            className="text-xs text-muted-foreground mt-0.5 line-clamp-2 [&_mark]:bg-primary/20 [&_mark]:text-primary [&_mark]:rounded-sm [&_mark]:px-0.5"
            dangerouslySetInnerHTML={{ __html: highlightText(excerpt, result.terms || []) }}
          />
        </div>
      </a>
    )
  }

  const showResults = results.length > 0
  const showEmpty = query.trim() && loaded && !showResults
  const showPrompt = loaded && !query.trim()
  const currentFilterLabel = FILTERS.find((f) => f.value === filter)?.label || "All"

  return (
    <SearchCtx.Provider value={{ open: handleOpen }}>
      {children}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/20 data-[state=closed]:animate-fd-dialog-out data-[state=open]:animate-fd-dialog-in" />
          <Dialog.Content
            className="fixed left-1/2 top-4 md:top-[calc(50%-250px)] z-50 w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 rounded-xl border bg-popover text-popover-foreground shadow-2xl shadow-black/50 overflow-hidden data-[state=closed]:animate-fd-dialog-out data-[state=open]:animate-fd-dialog-in focus-visible:outline-none"
            onKeyDown={onKeyDown}
            onPointerDownOutside={() => setIsOpen(false)}
          >
            <Dialog.Title className="hidden">Search</Dialog.Title>

            <div className="flex flex-row items-center gap-2 p-3 border-b">
              <Search className="size-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation…"
                className="w-0 flex-1 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <Dialog.Close className="inline-flex items-center justify-center rounded-md p-2 font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border hover:bg-accent hover:text-accent-foreground gap-1 px-2 py-1.5 text-xs font-mono text-muted-foreground shrink-0">
                ESC
              </Dialog.Close>
            </div>

            <div data-empty={!showResults} className="overflow-hidden border-b has-[[data-empty=true]]:border-b-0">
              <div
                ref={listRef}
                className={cn(
                  "w-full flex-col overflow-y-auto max-h-[460px] p-1",
                  showResults ? "flex" : "hidden",
                )}
                role="listbox"
              >
                {results.map((result, i) => renderResult(result, i))}
              </div>
              {showEmpty && (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}
              {showPrompt && !loading && !loadError && (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  Start typing to search&hellip;
                </div>
              )}
              {loading && (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  Loading search index&hellip;
                </div>
              )}
              {loadError && (
                <div className="flex items-center justify-center py-12 text-sm text-destructive">
                  {loadError}
                </div>
              )}
            </div>

            <div className="bg-secondary/50 p-3 flex flex-row flex-wrap gap-2 items-center empty:hidden">
              <button
                type="button"
                onClick={cycleFilter}
                className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground gap-1 px-2 py-1.5 text-xs -m-1.5 me-auto"
              >
                <span className="text-muted-foreground/80 me-2">Filter</span>
                {currentFilterLabel}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
              {results.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </SearchCtx.Provider>
  )
}
