---
title: "ctrodb: A Client-Side Database for TypeScript — Zero Dependencies"
tags: [typescript, javascript, database, opensource, webdev]
---

I got tired of wiring up IndexedDB by hand. Every new project needed the same boilerplate — open a connection, create object stores, handle version upgrades, write CRUD helpers. After the sixth time, I wrote ctrodb.

It's a database that runs in the browser and Node.js. Zero runtime dependencies. About 2,400 lines of TypeScript across 21 source files.

```typescript
import { Database } from "ctrodb"

const db = new Database({
  name: "my-app",
  schema: {
    version: 1,
    collections: {
      notes: {
        fields: {
          title: { type: "string", required: true },
          body: { type: "string" },
          pinned: { type: "boolean", default: false },
          tags: { type: "array", items: { type: "string" } },
          createdAt: { type: "string", default: () => new Date().toISOString() },
        },
        indexes: [{ field: "createdAt" }],
      },
    },
  },
})

await db.connect()
const notes = db.collection("notes")

const note = await notes.create({ title: "Hello", body: "World" })
const results = await notes.query()
  .where("pinned", true)
  .sort({ createdAt: "desc" })
  .limit(10)
  .fetch()
```

Records are Model proxies — `note.title` works, `note.update()` handles writes. Direct property assignment prints a warning telling you to use `.update()` instead.

## What's included

The core package ships with three plugins:

- **Full-text search** — inverted index, stop word removal, hooks into every create/update/delete automatically
- **Relations** — has_many, belongs_to, has_one with lazy accessors on every Model and eager loading via `.with()`
- **Custom validation** — add rules beyond the built-in email, URL, and regex validators

React hooks live in the same package under `ctrodb/react`:

```tsx
import { DatabaseProvider, useQuery, useMutation } from "ctrodb/react"
```

Signal-based reactivity. Change data and `useQuery` re-fetches. No Redux, no manual subscriptions.

## Why zero dependencies

The library ships as ESM, CJS, and IIFE. It works with any bundler, any framework, or directly from a `<script>` tag. The source is readable — 2,400 lines you can actually debug through.

## Try it

Browser playground at [ctrodb.vercel.app/playground](https://ctrodb.vercel.app/playground) — no install needed.

```
npm install ctrodb
```

GitHub: [github.com/ctrotech-tutor/ctrodb](https://github.com/ctrotech-tutor/ctrodb)
Docs: [ctrodb.vercel.app/docs](https://ctrodb.vercel.app/docs)

I'd love feedback on the API, the plugin system, or anything else.
