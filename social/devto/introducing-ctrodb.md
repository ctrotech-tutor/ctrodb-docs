---
title: "ctrodb: A Client-Side Database for TypeScript — Zero Dependencies"
description: "ctrodb is a reactive, schema-driven database that runs in the browser and Node.js. IndexedDB persistence, full-text search, React hooks, and zero runtime dependencies."
tags: [typescript, javascript, database, opensource, webdev]
---

I've been working on ctrodb — a client-side database for TypeScript that runs in the browser (IndexedDB) and Node.js (in-memory). Zero runtime dependencies. About 2,400 lines across 21 source files.

It started as a personal project to stop rewriting IndexedDB wrappers. Every new client-side app needed the same boilerplate: open a connection, create object stores, handle version upgrades, write CRUD helpers. After the sixth time, I wrote it once and got it right.

## What it does

ctrodb gives you MongoDB-like CRUD with schema validation at write time:

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

Every record is a Model — a Proxy wrapper with typed field access. `note.title` works. `note.update()` handles writes. Direct property assignment logs a warning telling you to use `.update()` instead.

## What's included

The core package ships with three plugins:

- **Full-text search** — inverted index, stop word removal, auto-indexed on create/update/delete
- **Relations** — has_many, belongs_to, has_one with lazy accessors built into every Model and eager loading via `.with()`
- **Custom validation** — extendable rules beyond the built-in validators (email, URL, regex)

Plus React hooks (separate import, same package):

```tsx
import { DatabaseProvider, useQuery, useMutation } from "ctrodb/react"
```

Signal-based reactivity. When data changes, `useQuery` re-fetches and your UI updates. No Redux, no Zustand, no manual subscriptions. Cross-tab sync works automatically through IndexedDB.

## Why zero dependencies

The library ships as ESM, CJS, and IIFE. Works with any bundler, any framework, or directly in a `<script>` tag. The entire source is 2,400 lines — readable, debuggable, and easy to contribute to.

## Try it

There's a browser playground at https://ctrodb.vercel.app/playground where you can run all 7 examples without installing anything.

```
npm install ctrodb
```

GitHub: https://github.com/ctrotech-tutor/ctrodb
Docs: https://ctrodb.vercel.app/docs

I'd love feedback on the API, the plugin system, or anything else.
