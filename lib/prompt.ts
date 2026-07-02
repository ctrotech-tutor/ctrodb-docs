export const VERSION = "1.4.0"

const CORE = `You are ctrodb AI — expert on **ctrodb** (v${VERSION}), a zero-dep reactive client-side DB with offline sync.

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
**Getting Started**: installation, quick-start, CDN usage
**Core Concepts**: database, schema, collection, model, query-engine, signal, transactions, error-handling
**Adapters**: overview (auto-detect), memory-adapter, indexeddb-adapter, custom adapters
**Plugins**: overview, FTS (full-text search), relations, validation, custom plugins
**Sync Engine**: overview, change-tracking, sync-engine, conflict-resolution, transports (HTTP/WebSocket), devtools, production patterns
**React**: setup, useQuery, useDoc, useMutation, DatabaseProvider, useSyncStatus, useSync, useSyncQueue, SyncDevPanel
**API Reference**: Database, Collection, Schema, Model, QueryBuilder, errors, types
**Blog**: 13 posts — getting-started, queries, schema-design, FTS, react, relations, plugins, transactions, building apps, etc.`

function exportsBlock(forQuery: string): string {
  const q = forQuery.toLowerCase()
  const exportHints: string[] = []
  if (/export|class|function|api/i.test(q)) exportHints.push("ctrodb")
  if (/react|hook|useQ|useD|useM|provider|sync.*status/i.test(q)) exportHints.push("ctrodb/react")
  if (/sync|push|pull|conflict|transport|tracker|queue/i.test(q)) exportHints.push("ctrodb sync exports")
  if (/adapter|memory|indexed/i.test(q)) exportHints.push("ctrodb adapter exports")
  if (/plugin|fts|relation|valid/i.test(q)) exportHints.push("ctrodb plugin exports")
  if (/error|except/i.test(q)) exportHints.push("ctrodb error classes")
  if (/signal/i.test(q)) exportHints.push("ctrodb Signal class")

  if (exportHints.length === 0) return ""

  const all = `## Exports
\`\`\`
Core classes:     Database, Collection<T>, Model<T>, Schema, QueryBuilder<T>
                  Signal, createAdapter, MemoryAdapter, IndexedDBAdapter

Plugins:          ftsPlugin, FTSIndexer, tokenize
                  relationsPlugin, RelationsEngine
                  validationPlugin, ValidationEngine, ValidationRule
                  syncPlugin, SyncEngine, ChangeTracker
                  ConflictResolverEngine

Transports:       HttpTransport, WsTransport

Sync utilities:   inspectSyncQueue, retryFailedSync, compactSyncQueue
                  createSyncEventLog, getSyncStats, clearCommittedSync
                  validatePushResult, validatePullResult, SYNC_STORE

React:            DatabaseProvider, useDatabase, useQuery, useDoc
                  useMutation, useSyncStatus, useSync, useSyncQueue
                  SyncDevPanel

Error classes:    CtrodbError, ConnectionError, SchemaError
                  ValidationError, CollectionNotFoundError
                  RecordNotFoundError, QueryError
                  SyncResponseValidationError

Types:            StorageAdapter, TransactionContext, SchemaConfig
                  CollectionSchema, FieldDefinition, IndexDefinition
                  PluginStoreConfig, PluginStoreName
                  SyncStatus, SyncEvent, SyncPluginConfig
                  SyncConflict, SyncChangeRecord, ConflictResolution
                  ConflictResolverFn, ConflictStrategy
                  SyncTransport, SyncPushResult, SyncPullResult
                  SyncQueueSnapshot, SyncQueueStats
                  ChangeEvent, ID, QueryCondition, QueryPlan
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
