---
title: "Building with ctrodb, Part 4: Relations and Schema Design"
description: "Model relationships between collections, set up validation rules, design schemas for real-world apps, and use lazy and eager loading."
tags: [typescript, database, schema, tutorial, series]
published: false
series: Building with ctrodb
---

In Part 3, you added full-text search. Now you'll model relationships between collections and design robust schemas.

Most data isn't isolated. Users have posts. Posts have comments. Products belong to categories. ctrodb handles these relationships with lazy accessors built into every Model, and eager loading via a plugin.

## Field types

ctrodb supports five field types, enforced at write time:

```typescript
const schema = {
  version: 1,
  collections: {
    products: {
      fields: {
        name: { type: "string" },
        price: { type: "number" },
        inStock: { type: "boolean" },
        metadata: { type: "object" },
        tags: { type: "array", items: { type: "string" } },
      },
    },
  },
}
```

Writing a string to a number field throws a `ValidationError`.

## Validation rules

### Required fields

```typescript
email: { type: "string", required: true }
```

### Built-in validators

```typescript
email: { type: "string", validate: "email" },
website: { type: "string", validate: "url" },
zipCode: { type: "string", validate: /^\d{5}(-\d{4})?$/ },
```

- `"email"` checks `<local>@<domain>.<tld>` format
- `"url"` tries `new URL()`
- `RegExp` tests the value against the pattern

### Custom validation functions

```typescript
age: {
  type: "number",
  validate: (value) => value >= 0 && value <= 150,
}
```

### Numeric and string constraints

```typescript
price: { type: "number", min: 0 },
quantity: { type: "number", min: 0, max: 999999 },
bio: { type: "string", maxLength: 500 },
```

## Default values

Static values and functions both work:

```typescript
role: { type: "string", default: "user" },
createdAt: { type: "string", default: () => new Date().toISOString() },
```

Function defaults run per-record. Useful for timestamps and UUIDs.

## Indexes

Indexes enable efficient queries and uniqueness:

```typescript
indexes: [
  { field: "email", unique: true },
  { field: "category" },
  { field: "createdAt" },
]
```

The query planner uses `index_scan` for indexed fields and `full_scan` for everything else.

## Relations

Define relationships in the schema:

```typescript
relations: {
  posts: { type: "has_many", collection: "posts", foreignKey: "userId" },
  profile: { type: "has_one", collection: "profiles", foreignKey: "userId" },
  author: { type: "belongs_to", collection: "users", foreignKey: "userId" },
}
```

### Lazy loading (built-in, no plugin needed)

Every Model gets lazy accessors automatically:

```typescript
const user = await users.get(1)
const posts = await user.posts.fetch()
```

Each call to `user.posts.fetch()` queries the database. No caching, no N+1 protection—but always consistent.

### Eager loading (requires relations plugin)

```typescript
import { relationsPlugin } from "ctrodb"

const db = new Database({ schema, plugins: [relationsPlugin()] })
await db.connect()

const usersWithPosts = await db.collection("users")
  .with("posts")
  .fetch()

// usersWithPosts[0].posts is already loaded
console.log(usersWithPosts[0].posts[0].title)
```

Eager loading fetches related records in a single batch, avoiding the N+1 problem.

## Error handling

Validation errors carry metadata:

```typescript
import { ValidationError, RecordNotFoundError, SchemaError } from "ctrodb"

try {
  await users.create({ email: "not-an-email" })
} catch (err) {
  if (err instanceof ValidationError) {
    console.error(err.field)      // "email"
    console.error(err.collection) // "users"
    console.error(err.value)      // "not-an-email"
  }
}
```

## A complete schema example

```typescript
const schema = {
  version: 1,
  collections: {
    profiles: {
      fields: {
        username: { type: "string", required: true, validate: /^[a-zA-Z0-9_]{3,20}$/ },
        displayName: { type: "string", required: true, maxLength: 100 },
        email: { type: "string", required: true, validate: "email" },
        age: { type: "number", min: 13, max: 120 },
        bio: { type: "string", maxLength: 500, default: "" },
        role: { type: "string", default: "user" },
        isActive: { type: "boolean", default: true },
        tags: { type: "array", items: { type: "string" } },
        createdAt: { type: "string", default: () => new Date().toISOString() },
      },
      indexes: [
        { field: "username", unique: true },
        { field: "email", unique: true },
        { field: "role" },
      ],
      searchable: ["bio"],
      relations: {
        posts: { type: "has_many", collection: "posts", foreignKey: "userId" },
      },
    },
  },
}
```

## Design patterns worth following

- **Add schemas early.** Catching a type error in the schema is faster than debugging a UI crash from bad data.
- **Use required + default together.** Required fields catch missing data. Defaults handle optional fields gracefully.
- **Index what you query.** Every field in a `where`, `sort`, or `search` call should have an index.
- **Set unique indexes for identifiers.** Emails, usernames, slugs—without uniqueness, you'll get duplicates.
- **Handle validation errors at the data layer.** Catch them when writing, not when rendering.

## What's next

In Part 5, you'll take your app to production with transactions, error handling, custom plugins, and performance tuning.

_ctrodb is open source. Try the playground at https://ctrodb.vercel.app/playground. GitHub: https://github.com/ctrotech-tutor/ctrodb._
