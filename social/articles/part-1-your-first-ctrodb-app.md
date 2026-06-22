---
title: "Building with ctrodb, Part 1: Your First ctrodb App"
description: "Set up ctrodb, define a schema, perform CRUD operations, and run your first queries. A hands-on introduction to client-side databases."
tags: [typescript, javascript, database, tutorial, beginners]
published: false
series: Building with ctrodb
---

Every web app needs to store data somewhere. For client-side state—form drafts, cached API responses, user preferences—sending it to a server adds unnecessary complexity. A client-side database keeps data where it's used: in the browser.

ctrodb is a TypeScript database that runs in the browser via IndexedDB, with an in-memory fallback for Node.js. Zero dependencies. Schema validation. Reactive queries.

In this first part, you'll build a note-taking app from scratch.

## Install

ctrodb runs in any modern browser and Node.js. Install it like any npm package:

```bash
npm install ctrodb
```

For a browser-only project, you can import it from a CDN.

## Create a database

Start by importing the `Database` class and creating an instance:

```typescript
import { Database } from "ctrodb"

const db = new Database({
  name: "notes-app",
  adapter: "indexeddb",
})
```

The `name` is used as the IndexedDB database name. The `adapter` tells ctrodb where to store data—IndexedDB in the browser, or memory for testing and Node.js.

Before you can use the database, you need to connect:

```typescript
await db.connect()
```

This opens the IndexedDB connection or initializes the memory store.

## Define a schema

Schemas describe the shape of your data. They validate fields on every write, apply defaults, and guide the query planner.

```typescript
const schema = {
  version: 1,
  collections: {
    notes: {
      fields: {
        title: { type: "string", required: true },
        body: { type: "string" },
        color: { type: "string", default: "yellow" },
        tags: { type: "array", items: { type: "string" } },
        pinned: { type: "boolean", default: false },
        createdAt: { type: "string", default: () => new Date().toISOString() },
      },
      indexes: [
        { field: "createdAt" },
        { field: "pinned" },
      ],
    },
  },
}
```

Each field has a `type`—string, number, boolean, object, or array. Array fields need an `items` type. Required fields throw on write if missing. Function defaults run per-record.

Indexes speed up queries and support uniqueness constraints. ctrodb's query planner picks index scans over full scans automatically.

Pass the schema when creating the database:

```typescript
const db = new Database({ name: "notes-app", schema })
await db.connect()
```

## CRUD operations

With the database connected, get a reference to a collection:

```typescript
const notes = db.collection("notes")
```

### Create

```typescript
const note = await notes.create({
  title: "Hello ctrodb",
  body: "This is my first note.",
  tags: ["demo"],
})
```

Every record is a Model—a Proxy wrapper that gives you typed field access:

```typescript
note.title   // "Hello ctrodb"
note.body    // "This is my first note."
note.pinned  // false (default applied)
note.id      // auto-generated string
note.toJSON() // plain object
```

Trying to set a property directly logs a warning telling you to use `.update()` instead.

### Read

Fetch a single record by ID:

```typescript
const n = await notes.get(note.id)
```

List all records:

```typescript
const all = await notes.list()
```

Count records:

```typescript
const count = await notes.count()
```

### Update

```typescript
await note.update({ pinned: true, color: "blue" })
```

Or update by ID:

```typescript
await notes.update(note.id, { body: "Updated body" })
```

### Delete

```typescript
await note.delete()
// or
await notes.delete(note.id)
```

## Queries with the QueryBuilder

For anything beyond listing all records, use the QueryBuilder:

```typescript
const results = await notes
  .query()
  .where("pinned", true)
  .sort({ createdAt: "desc" })
  .limit(5)
  .fetch()
```

The QueryBuilder supports:

- **where** — equality, comparison (`<`, `>`, `<=`, `>=`, `!=`), and array inclusion
- **sort** — ascending or descending on any field
- **limit / offset** — pagination
- **orWhere** — OR groups for complex conditions
- **count** — returns the count without loading records

```typescript
const recentUnpinned = await notes
  .query()
  .where("pinned", false)
  .where("createdAt", ">", "2024-01-01")
  .sort({ createdAt: "desc" })
  .limit(10)
  .fetch()
```

## Full example

Here's a complete note-taking setup:

```typescript
import { Database } from "ctrodb"

const schema = {
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
      indexes: [
        { field: "createdAt" },
        { field: "pinned" },
      ],
    },
  },
}

const db = new Database({ name: "notes-app", schema })
await db.connect()

const notes = db.collection("notes")

// Create
await notes.create({ title: "Write docs", body: "Document the API", tags: ["dev"] })
await notes.create({ title: "Buy groceries", body: "Milk, eggs, bread", pinned: true })

// Query pinned notes
const pinned = await notes
  .query()
  .where("pinned", true)
  .sort({ createdAt: "desc" })
  .fetch()

console.log(pinned.length) // 1
console.log(pinned[0].title) // "Buy groceries"
```

## What's next

In Part 2, you'll connect ctrodb to React with `useQuery`, `useMutation`, and reactive UIs that update automatically when data changes.

_ctrodb is open source. Try the playground at https://ctrodb.vercel.app/playground. GitHub: https://github.com/ctrotech-tutor/ctrodb. npm: https://www.npmjs.com/package/ctrodb. Docs: https://ctrodb.vercel.app/docs/getting-started/quick-start._
