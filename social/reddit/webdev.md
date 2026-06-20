I built a browser database so I could stop wiring up IndexedDB by hand

Every time I started a new client-side project, I'd copy-paste the same IndexedDB boilerplate. Open a connection. Create object stores. Handle version upgrades. Write CRUD helpers. Again.

So I built ctrodb — a database that wraps IndexedDB (with an in-memory fallback) and gives you a MongoDB-like API instead.

```typescript
const db = new Database({ name: "my-app", adapter: "indexeddb" })
await db.connect()

const notes = db.collection("notes")
const note = await notes.create({ title: "Hello", body: "World" })

const results = await notes
  .query()
  .search("title", "hello")
  .sort({ createdAt: "desc" })
  .fetch()
```

What makes it different from just using Dexie or localForage:
- Schema validation at write time — define field types, validators, and constraints upfront
- A query builder with chaining, sorting, pagination, and OR groups
- React hooks that re-run queries automatically when data changes
- Full-text search via an FTS plugin (inverted index, stop words, the works)
- Relations between collections — has_many, belongs_to, has_one — with lazy and eager loading

It's about 2,400 lines of TypeScript, zero dependencies, and ships as ESM, CJS, and IIFE.

npm: npm install ctrodb
GitHub: https://github.com/ctrotech-tutor/ctrodb

If you've dealt with client-side storage before, I'd be curious what pain points you've hit and whether something like this would help.
