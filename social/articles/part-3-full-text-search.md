---
title: "Building with ctrodb, Part 3: Client-Side Full-Text Search"
description: "Add full-text search to your app with ctrodb's FTS plugin. Inverted indexes, tokenization, stop words, and combining search with filters."
tags: [typescript, javascript, search, tutorial, series]
published: false
series: Building with ctrodb
---

In Part 2, you built a reactive UI with ctrodb and React. Now you'll add search.

Every app with text data needs search at some point. The typical approach is Elasticsearch or MeiliSearch on a server, with API endpoints and network round-trips. For client-side data, you can run search entirely in the browser.

## How full-text search works

At its core, full-text search builds an inverted index: a map from words to the documents containing them.

```
Token: "react"      → Documents: [1, 3, 7, 12]
Token: "hooks"      → Documents: [7, 12]
Token: "typescript" → Documents: [1, 5, 7]

Search "react hooks" → [7, 12]
```

When you search, the engine tokenizes your query, looks up each token in the index, and intersects the document sets. Same data structure Elasticsearch uses—just running in-process.

## Setting up the FTS plugin

ctrodb ships the full-text search plugin in the core package. Add it when creating the database:

```typescript
import { Database } from "ctrodb"
import { ftsPlugin } from "ctrodb"

const schema = {
  version: 1,
  collections: {
    articles: {
      fields: {
        title: { type: "string", required: true },
        body: { type: "string", required: true },
        published: { type: "boolean", default: false },
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

Once the plugin is active, indexing happens automatically on every create, update, and delete:

```typescript
const articles = db.collection("articles")

await articles.create({
  title: "Getting Started with React",
  body: "React is a JavaScript library for building user interfaces...",
})

await articles.update(article.id, {
  body: "React is a declarative UI library...",
})
```

The plugin hooks into `onAfterCreate`, `onAfterUpdate`, and `onAfterDelete` to keep the index in sync. No manual indexing calls needed.

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

The inverted index lives in a special `_ctrodb_fts` collection within the same adapter (IndexedDB or memory). Each entry maps a token to the set of document IDs that contain it. The index is persisted alongside your data—no separate rebuild needed on page load.

## Performance

Search performance depends on:
- **Unique tokens** — scales with vocabulary size, not document count
- **Result set size** — intersecting large document sets takes more time
- **Query token count** — each additional token adds an intersection

For typical datasets (hundreds to a few thousand documents), searches complete in single-digit milliseconds.

## When basic search is enough

ctrodb has two search paths:

| | Basic search | FTS plugin |
|---|---|---|
| API | `query().search()` | Same API |
| Matching | Substring (case-insensitive) | Token-based (whole words) |
| Index | None (full scan) | Inverted index |
| Stop words | No | Yes |
| Performance | Slower on large datasets | Fast on any size |
| Setup | None | Add `ftsPlugin()` to plugins |

Use basic search for small datasets or quick prototypes. Use the FTS plugin for more than a few hundred records, whole-word matching, or stop word removal.

## What's next

In Part 4, you'll model relationships between collections, set up validation rules, and design schemas for real-world apps.

_ctrodb is open source. Try the playground at https://ctrodb.vercel.app/playground. GitHub: https://github.com/ctrotech-tutor/ctrodb. npm: https://www.npmjs.com/package/ctrodb. Docs: https://ctrodb.vercel.app/docs/plugins/full-text-search._
