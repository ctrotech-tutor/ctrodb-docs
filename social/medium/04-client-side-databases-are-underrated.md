---
title: "Client-Side Databases Are Underrated"
tags: [webdev, architecture, javascript, performance, programming]
---

Most frontend data doesn't need a server round-trip. Form drafts, cached API responses, search indexes, offline queues — your browser already has a database that can handle all of it.

I spent years following the same pattern: build a backend, set up Postgres, wire up REST endpoints, fetch data on the client, cache it in React state or Redux. Somewhere along the way I realized a lot of the data I was sending to the server never needed to go there.

## The latency tax

A round-trip to the server costs 200-500ms on a fast connection. On mobile it's worse. Multiply that by every interaction that needs data, and the app feels sluggish even when the UI itself is fast.

The typical fix is caching — store API responses in localStorage, serve stale data while re-fetching, invalidate caches manually. It works, but you're maintaining two copies of the same data and hoping they stay in sync.

A client-side database flips the model: data lives where it's used. The server handles auth, shared state, and writes that need coordination. Everything else stays in the browser.

## What you get

- Schema validation at write time
- Queries with filtering, sorting, pagination
- Indexes for fast lookups
- Reactivity — subscribe to changes and re-render automatically
- No network calls, no serialization overhead

## A concrete example

I built ctrodb to explore this pattern. It's a client-side database that runs in the browser and Node.js, zero dependencies:

```typescript
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

Every record is a Model with typed field access. Update a record, and any React component using `useQuery` re-renders automatically. No cache invalidation, no loading spinners for data already on disk.

## When it makes sense

Client-side databases aren't for everything. But they shine for:

- **Offline-first apps** — notes, tasks, journaling tools
- **Search-heavy UIs** — full-text search indexes can live on the client
- **Form-heavy apps** — multi-step forms, draft-saving, autosave
- **Prototypes** — skip the backend entirely during early development

## The architecture shift

The mental model is subtle but powerful. Instead of "fetch from API, store in state, render," you think "query local database, render, sync to server."

Your UI becomes a view into a local database. No cache invalidation. The database is the store.

ctrodb is open source — [github.com/ctrotech-tutor/ctrodb](https://github.com/ctrotech-tutor/ctrodb) and [npmjs.com/package/ctrodb](https://www.npmjs.com/package/ctrodb). Try the playground at [ctrodb.vercel.app/playground](https://ctrodb.vercel.app/playground) or check the docs at [ctrodb.vercel.app/docs](https://ctrodb.vercel.app/docs).
