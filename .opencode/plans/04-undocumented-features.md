# Phase 4: Undocumented Library Features

Systematically explore `C:\Projects\project\lib\ctrodb\src` and create docs for features missing from the docs site.

## Existing doc pages (for reference)
- Getting Started: installation, quick-start, CDN
- Core Concepts: database, schema, collection, model, query-engine
- Adapters: overview, memory, indexeddb
- Plugins: overview, FTS, relations, validation, custom
- React: setup, use-query, use-doc, use-mutation, database-provider
- API Reference: database, collection, schema, model, query-builder, errors, types
- Examples: CDN todo, Node CLI, React SPA
- Migration: from-alpha

## Suspected gaps (from exports list)
- `Signal` — standalone pub/sub class, mentioned briefly in core concepts but no dedicated page
- `createAdapter` — mentioned in adapters overview but no "custom adapter" guide
- `setDefaultDatabase` / `getDb` — React utilities, no docs
- `db.transaction()` — exists in API but no dedicated page
- `QueryExecutor` / `QueryPlanner` — exported but undocumented (internal)
- `tokenize` — FTS utility, not documented
- `FTSIndexer` — part of FTS plugin, not documented
- `RelationsEngine` — part of relations plugin, not documented
- `ValidationEngine` — part of validation plugin, not documented

## Process

### Step 1: Deep library exploration
Read every source file in `C:\Projects\project\lib\ctrodb\src`:
- `index.ts` — exports map
- `react/` — all React exports
- `core/` — Database, Collection, Model, Schema, Signal
- `query/` — QueryBuilder, QueryExecutor, QueryPlanner
- `adapter/` — createAdapter, MemoryAdapter, IndexedDBAdapter
- `plugins/` — ftsPlugin, relationsPlugin, validationPlugin + their engines
- `errors.ts` — all error classes
- `types.ts` — all public types

### Step 2: Gap analysis
For each export, check if it has docs coverage. Tag:
- ✅ **Full coverage** — good docs
- ⚠️ **Partial coverage** — mentioned but no dedicated page
- ❌ **No coverage** — missing entirely

### Step 3: Create doc pages
For each ❌ or ⚠️ gap, create:
- A `.mdx` page in the appropriate `content/docs/` directory
- Add to `meta.json` ordering
- Wire sidebar + search index

### Step 4: Update library exports list
Update `lib/prompt.ts` exports list to match actual library exports (ensure AI has correct info).

## Likely new pages
| Page | Path | Content |
|------|------|---------|
| Signal | `core-concepts/signal.mdx` | Create/subscribe/unsubscribe, use cases, signals vs callbacks |
| Custom Adapters | `adapters/custom.mdx` | Implementing the Adapter interface, createAdapter patterns |
| Transactions | `core-concepts/transactions.mdx` | db.transaction(), auto rollback, nesting |
| React Database Provider | `react/database-provider.mdx` (update) | setDefaultDatabase, getDb for multi-DB setups |

## Out of scope
- Internal classes (QueryExecutor, QueryPlanner) — not useful for users
- Plugin engines (FTSIndexer, RelationsEngine, ValidationEngine) — only needed via plugins
