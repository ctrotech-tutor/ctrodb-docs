---
title: "Build a Todo App with ctrodb — No Build Step Required"
tags: [javascript, tutorial, html, css, database]
---

Let's build a todo app that runs entirely in the browser. Add todos, mark them done, delete them, clear all completed, or reset everything — all persisted to IndexedDB. One HTML file, no build step, no npm install.

## What we're building

- Add a todo by typing and pressing Enter or clicking Add
- Check the box to mark a todo as done (strikethrough)
- Delete individual todos
- Clear all completed at once
- Reset the entire list
- Stats: total count and done count
- Everything persists across page reloads

## Setting up

Create an HTML file. Load ctrodb from CDN:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ctrodb Todo</title>
  <script src="https://unpkg.com/ctrodb@1.0.1/dist/index.global.js"></script>
</head>
<body>
  <script>
  const { Database } = CtroDB
  </script>
</body>
</html>
```

ctrodb ships as an IIFE. After the script tag, `CtroDB` is the global namespace.

## Schema

Todos have three fields: text, done, and createdAt:

```javascript
const schema = {
  version: 1,
  collections: {
    todos: {
      fields: {
        text: { type: "string", required: true },
        done: { type: "boolean", default: false },
        createdAt: { type: "number" },
      },
    },
  },
}
```

## Connecting

```javascript
let db, todos

async function init() {
  db = new Database({ name: "todo-app", adapter: "indexeddb", schema })
  await db.connect()
  todos = db.collection("todos")
  render()
}

init()
```

## Render

`render()` queries all todos, updates the stats, builds the list, and attaches event handlers. It captures the `all` array once at render time, then each event handler maps to `all[i]` by index — works because the DOM order matches the array order at that moment.

```javascript
async function render() {
  const all = await todos.query().sort({ createdAt: "desc" }).fetch()
  const total = all.length
  const done = all.filter((t) => t.done).length

  document.getElementById("total-count").textContent = "Total: " + total
  document.getElementById("done-count").textContent = "Done: " + done

  const list = document.getElementById("todo-list")

  if (total === 0) {
    list.innerHTML = '<li class="empty-state">No todos yet. Add one above!</li>'
    return
  }

  list.innerHTML = all.map((todo) => `
    <li data-id="${todo.id}">
      <input type="checkbox" ${todo.done ? "checked" : ""} />
      <span class="${todo.done ? "todo-text done" : "todo-text"}">${escapeHtml(todo.text)}</span>
      <div class="todo-actions">
        <button class="delete-btn danger">Delete</button>
      </div>
    </li>
  `).join("")

  list.querySelectorAll("input[type='checkbox']").forEach((cb, i) => {
    cb.addEventListener("change", async () => {
      const todo = all[i]
      if (todo) {
        await todo.update({ done: cb.checked })
        render()
      }
    })
  })

  list.querySelectorAll(".delete-btn").forEach((btn, i) => {
    btn.addEventListener("click", async () => {
      const todo = all[i]
      if (todo) {
        await todo.delete()
        render()
      }
    })
  })
}
```

## Add, clear, reset

```javascript
document.getElementById("add-btn").addEventListener("click", async () => {
  const input = document.getElementById("new-todo-input")
  const text = input.value.trim()
  if (!text) return

  await todos.create({ text, done: false, createdAt: Date.now() })
  input.value = ""
  input.focus()
  render()
})
```

Clear done queries for completed items and deletes them in a loop. Reset fetches everything and calls `deleteMany`.

```javascript
document.getElementById("clear-done-btn").addEventListener("click", async () => {
  const doneItems = await todos.query().where("done", "==", true).fetch()
  for (const item of doneItems) await item.delete()
  render()
})

document.getElementById("reset-btn").addEventListener("click", async () => {
  if (!confirm("Delete all todos?")) return
  const all = await todos.getAll()
  await todos.deleteMany(all.map((t) => t.id))
  render()
})
```

## Full code

The complete HTML file is on GitHub at [github.com/ctrotech-tutor/ctrodb](https://github.com/ctrotech-tutor/ctrodb) in the `examples/cdn` directory. Save it as `todo.html` and open it in any browser. Everything stays in IndexedDB — close the file, reopen it, your todos are still there.
