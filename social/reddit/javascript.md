ctrodb — a 2,400-line client-side database that runs in the browser and Node

I needed a way to store data in the browser without pulling in a heavy dependency or writing IndexedDB wrappers for the Nth time.

ctrodb is what came out of that. It's a database that:
- Runs in the browser via IndexedDB or in-memory
- Runs in Node.js via an in-memory adapter
- Has zero runtime dependencies
- Is 2,400 lines of TypeScript across 21 source files
- Ships as ESM, CJS, and IIFE (works with any setup)

The API looks like this:

```javascript
import { Database } from "ctrodb"

const db = new Database({ name: "app" })
await db.connect()

const todos = db.collection("todos")
await todos.create({ title: "Ship it", done: false })

const pending = await todos
  .query()
  .where("done", false)
  .sort({ createdAt: "desc" })
  .fetch()
```

It comes with three plugins in the core package — full-text search, relations, and custom validation. Plus React hooks if you're into that sort of thing.

GitHub: https://github.com/ctrotech-tutor/ctrodb

Curious what you think — especially if you've used something like PouchDB or Gun before and have opinions on what works and what doesn't.
