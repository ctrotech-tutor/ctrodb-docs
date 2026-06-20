# Phase 2: Shared Search Index

Currently `search-context.tsx` and `use-ask-ai.ts` independently fetch `/search-index.json` and create their own `MiniSearch` instances. Fix by sharing a singleton.

## Architecture

### Singleton module: `lib/search-index.ts`
```ts
let cached: SearchDoc[] | null = null
let promise: Promise<SearchDoc[]> | null = null

export function getSearchIndex(): Promise<SearchDoc[]> {
  if (cached) return Promise.resolve(cached)
  if (promise) return promise
  promise = fetch("/search-index.json")
    .then(r => r.json())
    .then(data => { cached = data; return data })
  return promise
}
```

### Shared MiniSearch: `lib/search-engine.ts`
```ts
let ms: MiniSearch | null = null

export async function getSearchEngine(): Promise<MiniSearch> {
  if (ms) return ms
  const data = await getSearchIndex()
  ms = new MiniSearch({ ... })  // same config as before
  ms.addAll(data)
  return ms
}

export function searchDocs(query: string, filter?: "all"|"docs"|"blog") { ... }
```

## Files

### New files
| File | Purpose |
|------|---------|
| `lib/search-index.ts` | Singleton: fetch + cache the JSON index data |
| `lib/search-engine.ts` | Singleton: MiniSearch instance, shared search function |

### Files to modify
| File | Change |
|------|--------|
| `lib/search-context.tsx` | Replace inline fetch + MiniSearch with `getSearchEngine()`, `searchDocs()` |
| `lib/use-ask-ai.ts` | Replace inline fetch + MiniSearch with `getSearchEngine()`, `searchDocs()` |

## Benefits
- One network request total (not two)
- One MiniSearch instance in memory (not two)
- Consistent search results between search dialog and AI
- Simpler code in both consumers
