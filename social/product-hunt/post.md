Product Name: ctrodb
Tagline: A reactive, schema-driven client-side database for TypeScript — zero dependencies, IndexedDB persistence, React hooks.

Description:

ctrodb is a client-side database that runs in the browser and Node.js. Define a schema, get validation and typed queries. Built-in plugins for full-text search, relations, and custom validation. React hooks for reactive UIs that re-render when data changes.

Key features:
- MongoDB-like CRUD with a fluent QueryBuilder (where, sort, limit, offset, OR groups)
- Schema validation at write time — field types, required fields, email/URL/regex validators, defaults
- IndexedDB persistence out of the box (in-memory fallback for Node.js)
- Signal-based reactivity — subscribe to changes per-collection or database-wide
- React hooks: useQuery, useDoc, useMutation, DatabaseProvider
- Full-text search plugin with inverted index and stop word removal
- Relations plugin — has_many, belongs_to, has_one with lazy and eager loading
- Custom validation plugin with extensible rules
- Zero runtime dependencies — 2,400 lines of TypeScript
- Ships as ESM, CJS, and IIFE

First comment:

I built ctrodb because I kept writing the same IndexedDB wrappers for every client-side project. After the sixth time, I decided to write it once and get it right.

The library is about 2,400 lines of TypeScript across 21 source files. Zero dependencies. It runs in the browser (IndexedDB or memory), in Node.js (memory), and has React hooks for reactive UIs.

There's a playground at https://ctrodb.vercel.app/playground where you can try it in the browser — no install needed.

Would love to hear your feedback, especially if you've used client-side databases before.
