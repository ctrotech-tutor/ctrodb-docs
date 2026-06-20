---
title: "Building with ctrodb, Part 5: Production Ready"
description: "Transactions, error handling, custom plugins, and performance tuning. Patterns for running ctrodb reliably in real applications."
tags: [typescript, javascript, production, testing, series]
published: false
series: Building with ctrodb
---

In Part 4, you designed schemas with relations and validation. Now you'll make your app production-ready.

Getting a prototype working is easy. Keeping it reliable as your app grows requires transactions, proper error handling, and performance awareness.

## Transactions for atomic operations

When you need to update multiple collections atomically, use `db.transaction()`:

```typescript
await db.transaction(async (ctx) => {
  const accounts = ctx.collection("accounts")
  const transactionsCol = ctx.collection("transactions")

  const from = await accounts.findById(fromId)
  const to = await accounts.findById(toId)

  if (!from || from.balance < amount) {
    throw new Error("Insufficient funds")
  }

  await accounts.update(fromId, { balance: from.balance - amount })
  await accounts.update(toId, { balance: to.balance + amount })
  await transactionsCol.create({ fromId, toId, amount, timestamp: Date.now() })
})
```

If any operation throws, all changes are rolled back. The Memory adapter snapshots state and restores on error. The IndexedDB adapter uses native `IDBTransaction.abort()`.

Inside a transaction, `ctx.collection()` returns a raw adapter. Model wrappers, validation, and plugin hooks don't run. Transactions operate at the storage level for atomicity.

## Error classes

ctrodb has seven error classes:

```typescript
import {
  CtrodbError,
  ConnectionError,
  CollectionNotFoundError,
  RecordNotFoundError,
  SchemaError,
  ValidationError,
  QueryError,
} from "ctrodb"
```

A practical handling pattern:

```typescript
async function getUser(id: number) {
  try {
    const user = await users.get(id)
    if (!user) return { ok: false, error: "User not found" }
    return { ok: true, data: user }
  } catch (err) {
    if (err instanceof ConnectionError) {
      return { ok: false, error: "Database unavailable" }
    }
    throw err
  }
}
```

## Custom plugins

The plugin system hooks into every CRUD operation. Here are real-world examples.

### Audit logging

```typescript
const auditPlugin = {
  name: "audit",
  async onAfterCreate(collection, record) {
    console.log(`[AUDIT] Created ${collection}#${record.id}`)
  },
  async onAfterUpdate(collection, id, record, oldRecord) {
    console.log(`[AUDIT] Updated ${collection}#${id}`)
  },
  async onAfterDelete(collection, id, oldRecord) {
    console.log(`[AUDIT] Deleted ${collection}#${id}`)
  },
}
```

### Timestamp injection

```typescript
const timestampsPlugin = {
  name: "timestamps",
  onBeforeCreate(collection, data) {
    return { ...data, createdAt: new Date().toISOString() }
  },
  onBeforeUpdate(collection, id, changes) {
    return { ...changes, updatedAt: new Date().toISOString() }
  },
}
```

### Slug generation

```typescript
function slugPlugin({ source, target }) {
  return {
    name: "slug-generator",
    onBeforeCreate(collection, data) {
      if (data[source] && !data[target]) {
        const slug = data[source]
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
        return { ...data, [target]: slug }
      }
      return data
    },
  }
}
```

### Password validation

```typescript
const db = new Database({
  schema,
  plugins: [validationPlugin([
    {
      name: "strong-password",
      validate(collection, field, value) {
        if (field !== "password") return null
        if (typeof value !== "string" || value.length < 8) return "Too short"
        return null
      },
    },
  ])],
})
```

Plugin order matters. They execute in the order listed. For `onBeforeCreate` and `onBeforeUpdate`, each plugin can modify data by returning a value, which gets passed to the next plugin in the chain.

## Query performance

The query planner picks the best strategy based on available indexes:

- **id_lookup** — fastest, direct access by ID
- **index_scan** — uses an indexed field with range scanning
- **full_scan** — loads all records, filters in memory

To see which strategy your queries use:

```typescript
const db = new Database({ name: "app", schema, logLevel: "debug" })
```

Performance tips:

- **Index every field you query.** Without an index, the planner falls back to full scans.
- **Lead with equality conditions.** The planner prioritizes unique equality over range operators.
- **Use limit() early.** Even if you need all results, setting a limit helps the executor stop early.
- **Prefer count() over fetch().length.** count() returns the length without materializing Model instances.

## Testing

ctrodb works with any test framework. Use `adapter: "memory"` for fast unit tests:

```typescript
import { describe, it, expect } from "vitest"
import { Database } from "ctrodb"

describe("my app", () => {
  it("creates and queries records", async () => {
    const db = new Database({ adapter: "memory" })
    await db.connect()

    const items = db.collection("items")
    await items.create({ name: "Test" })
    const results = await items.query().where("name", "Test").fetch()

    expect(results).toHaveLength(1)
    expect(results[0].name).toBe("Test")
  })
})
```

Use `adapter: "indexeddb"` for integration tests that verify persistence. The `fake-indexeddb` npm package lets you run IndexedDB tests in Node.js.

## Lessons learned

- **Add schemas early.** Schema-less mode is great for prototyping. Adding a schema after data exists means dealing with existing records that don't match.
- **Use the validation plugin from day one.** Schema validation catches type errors. The validation plugin catches business rule violations like password strength and cross-field constraints. They complement each other.
- **Set up change event subscriptions for debugging.** `db.on((event) => ...)` in development tells you exactly when and where data changes.
- **Profile queries on real data sizes.** A full scan on 50 records is instant. A full scan on 50,000 records is not. Test with realistic volumes before shipping.

_ctrodb is open source. Try the playground at https://ctrodb.vercel.app/playground. GitHub: https://github.com/ctrotech-tutor/ctrodb._
