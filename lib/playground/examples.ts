import type { PlaygroundExample } from "./types"

export const EXAMPLES: PlaygroundExample[] = [
  {
    name: "Quick Start",
    description: "Create a database, define a schema, add and query data",
    code: `const { Database } = CtroDB

const db = new Database({
  adapter: "memory",
  schema: {
    version: 1,
    collections: {
      tasks: {
        fields: {
          title: { type: "string", required: true },
          done: { type: "boolean", default: false },
        },
      },
    },
  },
})

await db.connect()

const tasks = db.collection("tasks")
const task = await tasks.create({ title: "Build something cool" })
console.log("Created:", "id=" + task.id, "title=" + task.title, "done=" + task.done)

const all = await tasks.query().fetch()
console.log("All tasks count:", all.length)`,
  },
  {
    name: "CRUD Operations",
    description: "Create, read, update, and delete records",
    code: `const { Database } = CtroDB

const db = new Database({
  adapter: "memory",
  schema: {
    version: 1,
    collections: {
      notes: {
        fields: {
          title: { type: "string" },
          content: { type: "string" },
        },
      },
    },
  },
})
await db.connect()

const notes = db.collection("notes")

// Create
const note = await notes.create({ title: "Shopping list", content: "Milk, eggs, bread" })
console.log("Created:", "id=" + note.id)

// Read by ID
const found = await notes.get(note.id)
console.log("Read:", found?.title, found?.content)

// Update via model
await note.update({ content: "Milk, eggs, bread, cheese" })
console.log("Updated:", note.content)

// Query after update
const updated = await notes.query().where("id", "==", note.id).first()
console.log("From query:", updated?.content)

// Delete
await note.delete()
const remaining = await notes.count()
console.log("Remaining notes:", remaining)`,
  },
  {
    name: "Schema & Validation",
    description: "Define field types, defaults, and validation rules",
    code: `const { Database, ValidationError } = CtroDB

const db = new Database({
  adapter: "memory",
  schema: {
    version: 1,
    collections: {
      users: {
        fields: {
          email: { type: "string", required: true },
          age: { type: "number", min: 0, max: 150 },
          role: { type: "string", default: "user" },
        },
      },
    },
  },
})
await db.connect()

const users = db.collection("users")

// Valid — all required fields present, role defaults to "user"
const alice = await users.create({ email: "alice@example.com", age: 30 })
console.log("Created:", alice.email, "role=" + alice.role)

// Invalid — email is required
try {
  await users.create({ age: 25 })
} catch (err) {
  console.log("Validation error:", err instanceof ValidationError ? err.message : String(err))
}`,
  },
  {
    name: "Query Builder",
    description: "Filter, sort, limit, and offset queries",
    code: `const { Database } = CtroDB

const db = new Database({
  adapter: "memory",
  schema: {
    version: 1,
    collections: {
      items: {
        fields: {
          name: { type: "string" },
          price: { type: "number" },
          inStock: { type: "boolean" },
        },
      },
    },
  },
})
await db.connect()

const items = db.collection("items")

await items.create({ name: "Widget", price: 9.99, inStock: true })
await items.create({ name: "Gadget", price: 24.99, inStock: true })
await items.create({ name: "Doohickey", price: 4.99, inStock: false })
await items.create({ name: "Thingamajig", price: 49.99, inStock: true })

// Filter + sort + limit
const results = await items.query()
  .where("inStock", "==", true)
  .sort({ price: "asc" })
  .limit(2)
  .fetch()

console.log("In stock, cheapest first (max 2):")
results.forEach((r) => console.log(" -", r.name, "$" + r.price))`,
  },
  {
    name: "Full-Text Search",
    description: "Search across text fields with built-in substring matching",
    code: `const { Database } = CtroDB

const db = new Database({
  adapter: "memory",
  schema: {
    version: 1,
    collections: {
      articles: {
        fields: {
          title: { type: "string" },
          body: { type: "string" },
        },
      },
    },
  },
})
await db.connect()

const articles = db.collection("articles")

await articles.create({ title: "Getting Started", body: "Learn how to use ctrodb in your project" })
await articles.create({ title: "Advanced Queries", body: "Master complex query patterns with filters and sorting" })
await articles.create({ title: "React Integration", body: "Use ctrodb with React hooks for reactive UIs" })

// Search in the body field (case-insensitive substring match)
const results = await articles.query()
  .search("body", "react")
  .fetch()

console.log("Articles matching 'react':")
results.forEach((r) => console.log(" -", r.title))`,
  },
  {
    name: "Relations",
    description: "Define relationships between collections in the schema",
    code: `const { Database, relationsPlugin } = CtroDB

const db = new Database({
  adapter: "memory",
  schema: {
    version: 1,
    collections: {
      authors: {
        fields: { name: { type: "string" } },
        relations: {
          posts: { type: "has_many", collection: "posts", foreignKey: "authorId" },
        },
      },
      posts: {
        fields: { title: { type: "string" }, authorId: { type: "number" } },
        relations: {
          author: { type: "belongs_to", collection: "authors", foreignKey: "authorId" },
        },
      },
    },
  },
  plugins: [relationsPlugin()],
})
await db.connect()

const authors = db.collection("authors")
const posts = db.collection("posts")

const author = await authors.create({ name: "Alice" })

await posts.create({ title: "Post 1", authorId: author.id })
await posts.create({ title: "Post 2", authorId: author.id })

// Eager-load posts on the matching author
const result = await authors
  .with("posts")
  .where("id", "==", author.id)
  .first()

console.log("Author:", result?.name)
if (result?.posts) {
  result.posts.forEach((p) => console.log(" - Post:", p.title))
}`,
  },
  {
    name: "Transactions",
    description: "Atomic multi-operation updates with automatic rollback",
    code: `const { Database } = CtroDB

const db = new Database({
  adapter: "memory",
  schema: {
    version: 1,
    collections: {
      accounts: {
        fields: {
          name: { type: "string" },
          balance: { type: "number" },
        },
      },
    },
  },
})
await db.connect()

const accounts = db.collection("accounts")
await accounts.create({ name: "Alice", balance: 100 })
await accounts.create({ name: "Bob", balance: 50 })

// Transfer 30 from Alice to Bob atomically.
// Inside a transaction, use ctx.collection() which returns
// a raw CRUD interface (no schema validation or model wrapping).
await db.transaction(async (ctx) => {
  const raw = ctx.collection("accounts")
  const all = await raw.findAll()
  const alice = all.find((a) => a.name === "Alice")
  const bob = all.find((a) => a.name === "Bob")

  await raw.update(alice.id, { balance: alice.balance - 30 })
  await raw.update(bob.id, { balance: bob.balance + 30 })
})

const all = await accounts.query().fetch()
console.log("After transfer:")
all.forEach((a) => console.log(" " + a.name + ": $" + a.balance))`,
  },
]
