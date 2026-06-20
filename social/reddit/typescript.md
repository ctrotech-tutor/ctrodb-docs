I wrote a TypeScript client-side database with full type inference and zero dependencies

I've been working on ctrodb — a database that runs in the browser and Node.js, built entirely in TypeScript with zero runtime deps. The whole thing is about 2,400 lines across 21 source files.

The core idea: treat the client-side database the same way you'd treat a server-side one. Define a schema, get validation, run queries with a proper query planner, and react to changes.

```typescript
const db = new Database({
  schema: {
    version: 1,
    collections: {
      users: {
        fields: {
          name: { type: "string", required: true },
          email: { type: "string", validate: "email" },
          role: { type: "string", default: "user" },
          tags: { type: "array", items: { type: "string" } },
        },
        indexes: [{ field: "email", unique: true }],
        relations: {
          posts: { type: "has_many", collection: "posts", foreignKey: "userId" },
        },
      },
    },
  },
  plugins: [ftsPlugin(), relationsPlugin()],
})
```

Some things TypeScript makes possible here:
- QueryBuilder with typed field keys — users.query().where("name", "==", "Alice") auto-completes
- Model proxy gives transparent property access: user.name works, user.update() blocks direct assignment
- Schema type inference — fields are typed based on their definitions

The query planner picks index scans over full scans when it can. There's also a relations system with lazy getters (built into every Model) and eager loading via .with() when you need to avoid N+1.

GitHub: https://github.com/ctrotech-tutor/ctrodb
Docs + Playground: https://ctrodb.vercel.app

I'd love to hear what you think — especially about the type safety approach and plugin architecture.
