Show HN: ctrodb – A zero-dependency client-side database for TypeScript

I got tired of wiring up IndexedDB directly every time I needed client-side storage. So I built ctrodb — a reactive, schema-driven database that runs in the browser and Node.js with zero runtime dependencies.

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
item.title // "Try ctrodb" — proxy access
```

What it does:
- MongoDB-like CRUD with a fluent QueryBuilder (where, sort, limit, offset, orWhere)
- Schema validation at write time — field types, required fields, email/URL/regex validators, defaults
- IndexedDB persistence out of the box (in-memory fallback for Node.js)
- Signal-based reactivity — subscribe to changes on collections or the whole database
- React hooks via ctrodb/react — useQuery, useDoc, useMutation, DatabaseProvider
- Plugin system for FTS, relations, custom validation — all three ship with the core

I wrote more about the design on the docs site: https://ctrodb.vercel.app/docs

GitHub: https://github.com/ctrotech-tutor/ctrodb
npm: npm install ctrodb

Would love feedback on the API, the plugin system, or anything else.
