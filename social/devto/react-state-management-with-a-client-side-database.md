---
title: "React State Management Without Redux or Zustand"
description: "What if your database was the source of truth and your UI just reacted to changes? useQuery, useMutation, and why I stopped writing reducers."
tags: [react, typescript, hooks, state-management, database]
---

React state management has a well-worn path: pick a library (Redux, Zustand, Jotai, MobX), define your store shape, write actions and reducers, connect components, wire up side effects.

It works. But for data that lives on the client — form state, cached API responses, user preferences — there's a simpler approach.

What if your database was the source of truth and your UI just reacted to changes?

## The idea

Instead of fetching data from an API, storing it in state, and manually keeping things in sync, you query a local database directly. When data changes, the UI updates automatically. No reducers, no selectors, no cache invalidation.

ctrodb makes this pattern straightforward with three React hooks.

## Setup

Wrap your app with `DatabaseProvider`:

```tsx
import { Database } from "ctrodb"
import { DatabaseProvider } from "ctrodb/react"

const db = new Database({ name: "todos" })
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

`useQuery` runs a query and re-fetches whenever the collection changes:

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

The array contains Model instances. `todo.update()` and `todo.delete()` trigger re-fetches automatically.

Filter, sort, and paginate using the query builder callback:

```tsx
const pending = useQuery("todos", (q) =>
  q.where("done", false).sort({ createdAt: "desc" })
)

const page = useQuery("todos", (q) =>
  q.sort({ createdAt: "desc" }).limit(10).offset(page * 10)
)
```

## useDoc

Fetch a single record by ID:

```tsx
import { useDoc } from "ctrodb/react"

function TodoDetail({ id }) {
  const todo = useDoc("todos", id)
  if (!todo) return <p>Loading...</p>
  return <h2>{todo.title}</h2>
}
```

## useMutation

Create, update, and delete with loading and error state tracking:

```tsx
import { useMutation } from "ctrodb/react"

function AddTodo() {
  const [title, setTitle] = useState("")
  const { create, loading, error } = useMutation("todos")

  async function handleSubmit(e) {
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

## How reactivity works

ctrodb uses a Signal pattern. Every collection fires change events on create, update, and delete. The database has a global signal too.

```typescript
const unsubscribe = db.on((event) => {
  console.log(`${event.type} on ${event.collection}#${event.recordId}`)
})
```

`useQuery` subscribes to the database signal, checks if the event's collection matches, and re-fetches. That's the entire reactivity chain — no virtual DOM diffing, no selector memoization, no middleware.

## What this replaces

I used to reach for Redux or Zustand for every app that needed shared state. Now I reach for them less and less. If the data can live in IndexedDB, it lives in the database. The React hooks handle the rest.

If you're curious, ctrodb is open source. Try the playground at https://ctrodb.vercel.app/playground or check the docs at https://ctrodb.vercel.app/docs.
