---
title: "Why I Stopped Wiring Up IndexedDB by Hand"
tags: [javascript, typescript, webdev, programming, database]
---

Every new project starts the same way. You need to store something on the client. Maybe it's user preferences, maybe form drafts, maybe a search index. You open the MDN page for IndexedDB, copy the boilerplate, and start writing.

A few hours later you have something working. But it's fragile, untested, and you already know the next project will need the same thing all over again.

I wrote this pattern six times before I stopped.

## What makes IndexedDB hard

IndexedDB's API is built around requests and transactions. Every operation returns a `IDBRequest` with `onsuccess` and `onerror` callbacks. Need to chain operations? You're nesting callbacks or wrapping everything in promises yourself.

Here's what a basic create looks like with raw IndexedDB:

```javascript
const request = db.transaction(["todos"], "readwrite")
  .objectStore("todos")
  .add({ title: "Hello", done: false })

request.onsuccess = () => console.log("saved")
request.onerror = (e) => console.error(e)
```

Now do the same thing with schema validation, error handling, and a query builder. It's doable, but you're writing framework code instead of shipping features.

## The schema approach

I went in a different direction. Define the shape of your data upfront, and the library handles the rest:

```typescript
const db = new Database({
  name: "my-app",
  schema: {
    version: 1,
    collections: {
      todos: {
        fields: {
          title: { type: "string", required: true },
          done: { type: "boolean", default: false },
          createdAt: { type: "number" },
        },
        indexes: [{ field: "createdAt" }],
      },
    },
  },
})

await db.connect()
const todos = db.collection("todos")
```

Every write validates against the schema. Wrong type? Throws. Missing required field? Throws. Defaults fill in automatically.

## Queries without the ceremony

Instead of manual filtering, there's a query builder:

```typescript
const results = await todos
  .query()
  .where("done", false)
  .sort({ createdAt: "desc" })
  .limit(20)
  .fetch()
```

The planner picks index scans when it can, full scans when it has to. You don't think about it.

## Zero dependencies, 2,400 lines

The library has no runtime dependencies. It ships as ESM, CJS, and IIFE — works with any setup. The entire source is readable, debuggable, and easy to contribute to.

It's on GitHub at [github.com/ctrotech-tutor/ctrodb](https://github.com/ctrotech-tutor/ctrodb) and npm at [npmjs.com/package/ctrodb](https://www.npmjs.com/package/ctrodb). There's a playground at [ctrodb.vercel.app/playground](https://ctrodb.vercel.app/playground) if you want to try it without installing anything.

I wrote this because I got tired of repeating myself. If you've had the same frustration, give it a look.
