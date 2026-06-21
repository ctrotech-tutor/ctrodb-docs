---
title: "Full-Text Search in the Browser — No Server Required"
tags: [javascript, typescript, search, webdev, tutorial]
---

Search is one of those features that starts simple and gets complicated fast. A text input, a filter function, done. Then you add more data, and the filter gets slow. You want whole-word matching instead of substring. Suddenly you're looking at Elasticsearch.

For client-side data, you don't need a server. An inverted index running in-process handles search across thousands of documents in single-digit milliseconds.

## How an inverted index works

Instead of scanning every document for the search term, you build a map from words to the documents containing them:

```
Token: "react"      → Documents: [1, 3, 7, 12]
Token: "hooks"      → Documents: [7, 12]
Token: "typescript" → Documents: [1, 5, 7]

Search "react hooks" → [7, 12]
```

When you search, the engine tokenizes your query, looks up each token in the index, and intersects the document sets. Same data structure Elasticsearch uses — just running in your browser tab.

## Setting it up with ctrodb

ctrodb ships a full-text search plugin in the core package. Add it when creating the database:

```typescript
import { Database, ftsPlugin } from "ctrodb"

const db = new Database({
  schema: {
    version: 1,
    collections: {
      articles: {
        fields: {
          title: { type: "string", required: true },
          body: { type: "string", required: true },
        },
        searchable: ["title", "body"],
      },
    },
  },
  plugins: [ftsPlugin()],
})

await db.connect()
```

The `searchable` field tells the plugin which fields to index. After that, indexing happens automatically.

## Searching

Use `search()` on the query builder:

```typescript
const results = await articles
  .query()
  .search("title", "react")
  .fetch()
```

Search across fields. Combine with filters. Paginate. It all works together:

```typescript
const results = await articles
  .query()
  .search("body", "hooks")
  .where("published", true)
  .sort({ createdAt: "desc" })
  .limit(10)
  .fetch()
```

## Two search paths

ctrodb has two modes. Without the plugin, `.search()` does case-insensitive substring matching — fast enough for small datasets. With the plugin, it uses the inverted index for tokenized whole-word search.

Both use the same API. Start with basic search, add the plugin when your dataset grows. No code changes needed.

## The index lives with your data

The inverted index is stored in IndexedDB alongside your data. It persists across page loads and updates automatically when records change. No separate rebuild step.

The plugin is about 200 lines of TypeScript. You can read through the whole thing in an afternoon.

The library is at [github.com/ctrotech-tutor/ctrodb](https://github.com/ctrotech-tutor/ctrodb) and [npmjs.com/package/ctrodb](https://www.npmjs.com/package/ctrodb). Try the playground at [ctrodb.vercel.app/playground](https://ctrodb.vercel.app/playground) to see FTS in action.
