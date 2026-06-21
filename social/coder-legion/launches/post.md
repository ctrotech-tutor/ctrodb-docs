---
name: "ctrodb"
tagline: "Reactive client-side database for TypeScript"
website: "https://ctrodb.vercel.app"
repository: "https://github.com/ctrotech-tutor/ctrodb"
license: "MIT"
status: "Actively Maintained"
lookingForContributors: true
tags: [typescript, database, opensource]
---

I built ctrodb because I kept writing the same IndexedDB wrappers for every client-side project.

It's a database that runs in the browser and Node.js. Define a schema, get validation and typed queries. Built-in plugins for full-text search, relations, and custom validation. React hooks for reactive UIs that re-render when data changes.

## What it does

- MongoDB-like CRUD with a fluent QueryBuilder (where, sort, limit, offset, orWhere)
- Schema validation at write time — field types, required checks, email/URL/regex validators, defaults
- IndexedDB persistence out of the box (in-memory fallback for Node.js)
- Signal-based reactivity — subscribe to changes per-collection or database-wide
- React hooks: useQuery, useDoc, useMutation, DatabaseProvider
- Full-text search plugin with inverted index and stop word removal
- Relations plugin — has_many, belongs_to, has_one with lazy and eager loading
- Custom validation plugin with extensible rules
- Zero runtime dependencies — 2,400 lines of TypeScript

## How it looks

```typescript
import { Database } from "ctrodb"

const db = new Database({
  name: "my-app",
  adapter: "indexeddb",
  schema: {
    version: 1,
    collections: {
      todos: {
        fields: {
          title: { type: "string", required: true },
          done: { type: "boolean", default: false },
        },
      },
    },
  },
})

await db.connect()
const todos = db.collection("todos")
const item = await todos.create({ title: "Try ctrodb" })
```

## Try it

Browser playground at [ctrodb.vercel.app/playground](https://ctrodb.vercel.app/playground) — no install needed.

```
npm install ctrodb
```

## Contributing

The project is actively maintained and open to contributions. Check the GitHub repo for issues and discussions.
