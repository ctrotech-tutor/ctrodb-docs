---
title: "A Database That Lives in Your Browser"
tags: [typescript, javascript, database, webdev, opensource]
---

I've lost count of how many times I've written the same IndexedDB code. Open a connection. Create object stores. Handle the version upgrade event. Write CRUD helpers. Test it. Throw it away. Start over on the next project.

After the sixth time, I decided to write it once and get it right.

## The problem with client-side storage

localStorage is synchronous and caps out at 5MB. IndexedDB works but the API was designed for C++ databases, not JavaScript. You get a `request` object with `onsuccess` and `onerror` callbacks, a `transaction` that can throw for vague reasons, and an `onupgradeneeded` event that fires at unexpected times.

Wrappers exist, but they tend to pull in dependencies or lock you into a specific framework.

## What I built

ctrodb is a TypeScript database that runs in the browser using IndexedDB, with an in-memory fallback for Node.js. Zero dependencies. The whole thing is about 2,400 lines across 21 source files.

Define a schema and get validation at write time:

```typescript
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
          createdAt: { type: "string", default: () => new Date().toISOString() },
        },
        indexes: [{ field: "createdAt" }],
      },
    },
  },
})

await db.connect()
const notes = db.collection("notes")
```

Query with a fluent builder:

```typescript
const results = await notes
  .query()
  .where("pinned", true)
  .sort({ createdAt: "desc" })
  .limit(10)
  .fetch()
```

Every record is a Model proxy. `note.title` reads the field. `note.update()` persists changes.

## Plugins ship in the core

The same package includes full-text search (inverted index, stop words, auto-indexed), relations (has_many, belongs_to, has_one with lazy and eager loading), and custom validation. No separate packages to install.

React hooks live at `ctrodb/react`:

```tsx
const todos = useQuery("todos", (q) => q.sort({ createdAt: "desc" }))
const { create } = useMutation("todos")
```

Change a record and `useQuery` re-fetches. The UI updates. No store, no middleware.

## Try it

Browser playground at [ctrodb.vercel.app/playground](https://ctrodb.vercel.app/playground) — no install needed.

```
npm install ctrodb
```

GitHub: [github.com/ctrotech-tutor/ctrodb](https://github.com/ctrotech-tutor/ctrodb)
npm: [npmjs.com/package/ctrodb](https://www.npmjs.com/package/ctrodb)
Docs: [ctrodb.vercel.app/docs](https://ctrodb.vercel.app/docs)

I'd love to hear what you think — especially if you've dealt with client-side storage before.
