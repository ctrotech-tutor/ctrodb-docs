---
title: "Build a Reactive Todo App Without Redux or Zustand"
tags: [react, javascript, typescript, tutorial, webdev]
---

I've reached for Redux or Zustand on almost every React project that needed shared state. Setup a store, write reducers, connect components, wire up side effects. It works, but it's a lot of ceremony for data that lives on the client.

What if your database was the source of truth and your UI just reacted to changes?

## The idea

Instead of fetching data from an API and storing it in state, you query a local database directly. When data changes, the UI updates automatically. No reducers, no selectors, no cache invalidation.

ctrodb makes this pattern straightforward with React hooks.

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

`useQuery` runs a query and re-fetches when the collection changes:

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

The array contains Model instances. `todo.update()` triggers a re-fetch automatically.

Filter, sort, paginate using the query builder:

```tsx
const pending = useQuery("todos", (q) =>
  q.where("done", false).sort({ createdAt: "desc" })
)
```

## useDoc and useMutation

`useDoc` fetches a single record by ID. `useMutation` wraps create/update/delete with loading and error state:

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

ctrodb uses a Signal pattern. Every collection fires change events on create, update, and delete. `useQuery` subscribes to these events and re-fetches. That's the whole chain — no virtual DOM diffing, no selector memoization, no middleware.

## What this replaces

I used to reach for Redux or Zustand for every app that needed shared state. Now I reach for them less and less. If the data can live in IndexedDB, it lives in the database. The hooks handle the rest.

ctrodb is open source at [github.com/ctrotech-tutor/ctrodb](https://github.com/ctrotech-tutor/ctrodb) and [npmjs.com/package/ctrodb](https://www.npmjs.com/package/ctrodb). Try the playground at [ctrodb.vercel.app/playground](https://ctrodb.vercel.app/playground).
