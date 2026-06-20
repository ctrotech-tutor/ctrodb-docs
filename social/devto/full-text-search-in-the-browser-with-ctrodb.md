---
title: "Full-Text Search in the Browser with ctrodb"
description: "Build client-side search with an inverted index, stop word removal, and automatic indexing. No server, no API key, no network request."
tags: [typescript, javascript, search, webdev, tutorial]
---

Search is one of those features that starts simple and gets complicated fast. A text input, a filter function, done. Then you add more data, and the filter gets slow. You want whole-word matching instead of substring. You need stop word removal. Suddenly you're looking at Elasticsearch.

For client-side data — notes, bookmarks, cached content, documentation — you can run full-text search entirely in the browser. No server, no API key, no network request.

## How it works

Full-text search builds an inverted index: a map from words to the documents containing them.

```
Token: "react"      → Documents: [1, 3, 7, 12]
Token: "hooks"      → Documents: [7, 12]
Token: "typescript" → Documents: [1, 5, 7]

Search "react hooks" → [7, 12]
```

When you search, the engine tokenizes your query, looks up each token, and intersects the document sets. Same data structure Elasticsearch uses — just in-process.

## Setting up the FTS plugin

ctrodb ships a full-text search plugin in the core package. Add it when creating the database:

```typescript
import { Database, ftsPlugin } from "ctrodb"

const schema = {
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
}

const db = new Database({
  name: "blog",
  schema,
  plugins: [ftsPlugin()],
})

await db.connect()
```

The `searchable` field tells the plugin which fields to tokenize and index.

## Automatic indexing

Once the plugin is active, indexing happens automatically on every write. The plugin hooks into `onAfterCreate`, `onAfterUpdate`, and `onAfterDelete` to keep the index in sync:

```typescript
const articles = db.collection("articles")

await articles.create({
  title: "Getting Started with React",
  body: "React is a JavaScript library for building user interfaces...",
})

// Index updates automatically

await articles.update(article.id, {
  body: "React is a declarative UI library...",
})

// Index updates automatically

await articles.delete(article.id)
// Index updates automatically
```

## Searching

Use the `search()` method on the QueryBuilder:

```typescript
const results = await articles
  .query()
  .search("title", "react")
  .fetch()
```

Combine search with other query features:

```typescript
const results = await articles
  .query()
  .search("body", "hooks")
  .where("published", true)
  .sort({ createdAt: "desc" })
  .limit(10)
  .fetch()
```

Search multiple fields with OR logic:

```typescript
const results = await articles
  .query()
  .search("title", query)
  .orWhere((q) => q.search("body", query))
  .sort({ publishedAt: "desc" })
  .fetch()
```

## How the index is stored

The inverted index lives in a `_ctrodb_fts` collection within the same adapter (IndexedDB or memory). Each entry maps a token to the set of document IDs containing it. The index persists alongside your data — no separate rebuild on page load.

## Performance

Search performance depends on unique token count, result set size, and query length. For datasets with hundreds to a few thousand documents, searches complete in single-digit milliseconds.

## When basic search is enough

ctrodb has two search paths. Basic search uses substring matching with a full scan — fine for small datasets. The FTS plugin uses an inverted index with stop word removal — fast at any size.

Both use the same `query().search()` API. Start with basic search, add the plugin when you need it. No code changes required beyond adding the plugin.

---

_ctrodb is open source. Try it in your browser at https://ctrodb.vercel.app/playground. GitHub: https://github.com/ctrotech-tutor/ctrodb._
