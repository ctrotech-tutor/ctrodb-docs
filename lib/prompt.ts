export const VERSION = "1.0.1"

const CORE = `You are ctrodb AI — expert on **ctrodb** (v${VERSION}), a zero-dep reactive client-side DB.

## Rules
1. Never hallucinate. If unsure say so.
2. Cite sources with [1], [2] when referencing context.
3. Language tags on ALL code fences.
4. Complete examples when asked (all imports, async/await).
5. Tables for comparisons/options.
6. **Try next**: "?" for follow-ups on substantive answers.
7. Be concise. Stay on topic. No "etc." or "and more".

## Response depth
- **Simple** ("what is X"): 1-3 sentences. Code only if helpful.
- **Moderate** ("how do I"): answer + example. Tables if options.
- **Complex** ("compare", 15+ words): full structure — answer, runnable code, API table, links, follow-ups.
- Web search results may be appended as ## Web search results — use them.`

const DOCS_OVERVIEW = `## Docs
**Getting Started**: installation, quick-start, CDN
**Core**: database, schema, collection, model, query-engine
**Adapters**: memory, indexeddb
**Plugins**: FTS, relations, validation
**React**: hooks, provider
**API**: DB, Collection, Schema, Model, QueryBuilder, errors, types
**Blog**: 5 posts`

function exportsBlock(forQuery: string): string {
  const q = forQuery.toLowerCase()
  const exportHints: string[] = []
  if (/export|class|function|api/i.test(q)) exportHints.push("ctrodb")
  if (/react|hook|useQ|useD|useM|provider/i.test(q)) exportHints.push("ctrodb/react")
  if (/adapter|memory|indexed/i.test(q)) exportHints.push("ctrodb adapter exports")
  if (/plugin|fts|relation|valid/i.test(q)) exportHints.push("ctrodb plugin exports")
  if (/error|except/i.test(q)) exportHints.push("ctrodb error classes")

  if (exportHints.length === 0) return ""

  const all = `## Exports
\`\`\`
ctrodb:            Database, Collection, Model, Schema, QueryBuilder, QueryExecutor
                   QueryPlanner, Signal, createAdapter, MemoryAdapter, IndexedDBAdapter
                   ftsPlugin, FTSIndexer, tokenize, relationsPlugin, RelationsEngine
                   validationPlugin, ValidationEngine
                   CtrodbError, ConnectionError, CollectionNotFoundError
                   RecordNotFoundError, SchemaError, ValidationError, QueryError
ctrodb/react:      DatabaseProvider, useDatabase, useQuery, useDoc, useMutation
                   setDefaultDatabase, getDb
\`\`\``
  return all
}

export function buildPrompt(
  question: string,
  context: string,
  webResults: string,
  history: string,
): string {
  const parts = [CORE]

  const exports = exportsBlock(question)
  if (exports) parts.push(exports)

  if (!isGreeting(question)) {
    parts.push(DOCS_OVERVIEW)
  }

  if (history) parts.push(`## Conversation history\n${history}`)
  parts.push(`## Documentation context\n${context || "No specific docs found for this query."}`)
  if (webResults) parts.push(`## Web search results\n${webResults}`)
  parts.push(`## User question\n${question}`)

  return parts.join("\n\n")
}

export function isGreeting(question: string): boolean {
  return /^(hi|hello|hey|thanks?|thank you|yo|sup|good morning|good evening|good afternoon)[.!]*$/i.test(
    question.trim(),
  )
}
