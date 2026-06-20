---
title: "Building with ctrodb, Part 2: Reactive UIs with ctrodb and React"
description: "Connect ctrodb to React with DatabaseProvider, useQuery, useMutation, and useDoc. Build UIs that update automatically when data changes."
tags: [react, typescript, hooks, tutorial, series]
published: false
series: Building with ctrodb
---

In Part 1, you set up ctrodb and ran CRUD operations. Now you'll connect it to React.

React state management usually means picking a library, defining a store, writing reducers, and wiring up selectors. With ctrodb, your database is the store. Components query data directly and re-render when it changes. No middleware. No cache invalidation. No manual subscriptions.

## DatabaseProvider

Wrap your app with `DatabaseProvider` to make the database available to every component:

```tsx
import { Database } from "ctrodb"
import { DatabaseProvider } from "ctrodb/react"

const db = new Database({ name: "todos", adapter: "indexeddb" })
await db.connect()

export default function App() {
  return (
    <DatabaseProvider db={db}>
      <TodoApp />
    </DatabaseProvider>
  )
}
```

## useQuery

`useQuery` runs a query whenever the collection changes. When any record is created, updated, or deleted, it re-fetches and returns fresh data:

```tsx
import { useQuery } from "ctrodb/react"

function TodoList() {
  const todos = useQuery("todos", (q) =>
    q.sort({ createdAt: "desc" })
  )

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => todo.update({ done: !todo.done })}
          />
          {todo.title}
        </li>
      ))}
    </ul>
  )
}
```

The array contains Model instances. `todo.update()` and `todo.delete()` work directly. The UI updates automatically after the operation completes.

### Filtered queries

The second argument is a query builder callback. Filter, sort, and paginate:

```tsx
const pending = useQuery("todos", (q) =>
  q.where("done", false).sort({ createdAt: "desc" })
)

const page = useQuery("todos", (q) =>
  q.sort({ createdAt: "desc" }).limit(10).offset(page * 10)
)
```

## useDoc

Fetch a single record by ID. Re-fetches when the record changes:

```tsx
import { useDoc } from "ctrodb/react"

function TodoDetail({ id }: { id: string }) {
  const todo = useDoc("todos", id)

  if (!todo) return <p>Loading...</p>

  return (
    <div>
      <h2>{todo.title}</h2>
      <p>Status: {todo.done ? "Done" : "Pending"}</p>
    </div>
  )
}
```

## useMutation

`useMutation` wraps create/update/delete and tracks loading and error states:

```tsx
import { useMutation } from "ctrodb/react"

function AddTodo() {
  const [title, setTitle] = useState("")
  const { create, loading, error } = useMutation("todos")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await create({
      title,
      done: false,
      createdAt: new Date().toISOString(),
    })
    setTitle("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit" disabled={loading || !title.trim()}>
        {loading ? "Adding..." : "Add todo"}
      </button>
      {error && <p className="error">{error.message}</p>}
    </form>
  )
}
```

The hook returns `{ create, update, remove, loading, error }`. Each operation returns a promise that resolves when the write completes.

## How reactivity works

ctrodb uses a Signal pattern for change events. Every collection has a change signal that fires on create, update, and delete. The database has a global signal too.

```typescript
const unsubscribe = db.on((event) => {
  console.log(`${event.type} on ${event.collection}#${event.recordId}`)
})

const unsub = collection.onChange((event) => {
  if (event.type === "create") {
    console.log("New record:", event.record)
  }
})
```

`useQuery` subscribes to the database signal, checks if the event's collection matches, and re-fetches if it does. That's the entire reactivity chain.

## SSR considerations

`useQuery` returns an empty array during SSR and hydrates on the client. Wrap database-dependent components in a client boundary:

```tsx
"use client"

export function ClientTodoApp() {
  return (
    <DatabaseProvider db={db}>
      <TodoApp />
    </DatabaseProvider>
  )
}
```

## What's next

In Part 3, you'll add full-text search to your app with ctrodb's FTS plugin.

_ctrodb is open source. Try the playground at https://ctrodb.vercel.app/playground. GitHub: https://github.com/ctrotech-tutor/ctrodb._
