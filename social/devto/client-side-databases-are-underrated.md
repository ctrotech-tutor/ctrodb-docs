---
title: "Client-Side Databases Are Underrated"
description: "Most frontend data doesn't need a server round-trip. Form drafts, cached API responses, search indexes, offline queues — your browser has a perfectly good database."
tags: [javascript, webdev, architecture, database]
---

For the last five years, I've worked on web apps that follow the same pattern: build a backend, set up Postgres, wire up REST endpoints, fetch data on the client, cache it in React state or Redux.

Somewhere along the way, I realized a lot of the data I was sending to the server never needed to go there.

Form drafts. UI preferences. Search indexes. Cached API responses. Offline queues. All of it lives on the client already — it just takes a detour through the network for no real reason.

## The latency tax

A round-trip to the server costs 200-500ms on a fast connection. On mobile, it's worse. Multiply that by every interaction that needs data, and your app feels sluggish even when the UI is technically fast.

The typical fix is caching: store API responses in localStorage, serve stale data while re-fetching, invalidate caches manually. It works, but it's fighting the architecture. You're maintaining two copies of the same data — one in a cache, one in state — and hoping they stay in sync.

A client-side database flips the model: data lives where it's used. The server mediates shared state, auth, and writes that need coordination. Everything else stays in the browser.

## What a client-side database gives you

The same primitives you'd expect from a server-side database, running in-process:

- Schema validation at write time
- Queries with filtering, sorting, and pagination
- Indexes for fast lookups
- Transactions for atomic multi-collection operations
- Reactivity — subscribe to changes and re-render automatically

No network calls. No connection pooling. No serialization overhead.

## A concrete example

I built ctrodb to explore this pattern. It's a client-side database that runs in the browser (IndexedDB) with zero dependencies:

```typescript
import { Database } from "ctrodb"

const db = new Database({ name: "app" })
await db.connect()

const todos = db.collection("todos")
await todos.create({ title: "Try ctrodb", done: false })

const pending = await todos
  .query()
  .where("done", false)
  .sort({ createdAt: "desc" })
  .fetch()
```

Every record is a Model with typed field access. Update a record, and any React component using `useQuery` re-renders automatically.

## When it makes sense

Client-side databases aren't for everything. But they shine for:

- **Offline-first apps** — notes, tasks, journaling tools
- **Local-first architecture** — data lives in the browser, sync with a server when needed
- **Search-heavy UIs** — full-text search indexes can live on the client
- **Form-heavy apps** — multi-step forms, draft-saving, autosave
- **Prototypes** — skip the backend entirely during early development

## The architecture shift

The mental model is subtle but powerful. Instead of "fetch from API → store in state → render", you think "query local database → render → sync to server".

Your UI becomes a view into a local database. No cache invalidation. No loading spinners for data that's already on disk. The database is the store.

---

If you're curious, ctrodb is open source. Try the playground at https://ctrodb.vercel.app/playground or check the docs at https://ctrodb.vercel.app/docs/getting-started/quick-start.
