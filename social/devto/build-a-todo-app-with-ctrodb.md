---
title: "Build a Todo App with ctrodb — No Build Step Required"
description: "A complete todo app with add, complete, delete, clear done, and reset — all persisted to IndexedDB. One HTML file, zero dependencies."
tags: [javascript, tutorial, html, database]
---

Let's build a todo app that runs entirely in the browser. Add todos, mark them done, delete them, clear all completed, or reset everything — all persisted to IndexedDB. One HTML file, no build step, no npm install.

This is the official ctrodb CDN example, and we'll walk through every piece of it.

## What we're building

- Add a todo by typing and pressing Enter or clicking Add
- Check the box to mark a todo as done (strikethrough)
- Delete individual todos
- Clear all completed todos at once
- Reset the entire list
- Stats display: total count and done count
- Status messages for feedback
- Everything persists across page reloads

## Setting up

Create an HTML file. Load ctrodb from CDN and write your own CSS:

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

ctrodb ships as an IIFE. After the script tag, `CtroDB` is the global namespace — destructure `Database` from it.

## Schema design

Todos have three fields: text (the task), done (completed or not), and createdAt (for sorting):

```javascript
const db = new Database({
  name: "todo-app",
  adapter: "indexeddb",
  schema: {
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
  },
})
```

`text` is required — ctrodb throws on save if it's missing. `done` defaults to `false`. `createdAt` stores a timestamp for sorting newest-first.

## Connecting and initializing

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

`db.connect()` opens the IndexedDB connection or creates it. `db.collection("todos")` returns the collection handle we use for all CRUD.

## The render function

`render()` is the heart of the app. It queries all todos, updates the stats, renders the list, and attaches event handlers:

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

  // Attach event handlers using the `all` array + index
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

Key details:
- `all` is the array of models from the query — captured once at render time
- Each rendered element maps to `all[i]` by index
- Checkbox change calls `todo.update({ done: cb.checked })` — partial update
- Delete button calls `todo.delete()` — removes from IndexedDB
- Both re-render after the operation

## Adding todos

The Add button and Enter key both trigger the same logic:

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

document.getElementById("new-todo-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("add-btn").click()
})
```

The `create` call passes the initial fields. `done` defaults to `false` from the schema. `createdAt` is set to the current timestamp for sorting.

## Clear done and reset

Two bulk operations:

```javascript
// Clear all completed todos
document.getElementById("clear-done-btn").addEventListener("click", async () => {
  const doneItems = await todos.query().where("done", "==", true).fetch()
  for (const item of doneItems) await item.delete()
  render()
  showStatus("Cleared " + doneItems.length + " completed todo(s).", "success")
})

// Reset everything
document.getElementById("reset-btn").addEventListener("click", async () => {
  if (!confirm("Delete all todos?")) return
  const all = await todos.getAll()
  await todos.deleteMany(all.map((t) => t.id))
  render()
  showStatus("All todos deleted.", "success")
})
```

`todos.getAll()` fetches every record. `todos.deleteMany()` removes them all in one operation.

## Status messages

A simple helper shows feedback for errors and success:

```javascript
function showStatus(msg, type) {
  const el = document.getElementById("status")
  el.textContent = msg
  el.className = type
  setTimeout(() => {
    el.className = ""
    el.style.display = "none"
  }, 3000)
}
```

The status div is hidden by default and shown by setting its class to `"error"` or `"success"`.

## Complete code

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ctrodb — Todo App</title>
    <style>
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        max-width: 600px;
        margin: 40px auto;
        padding: 0 20px;
        color: #1a1a2e;
        background: #f8f9fa;
      }
      h1 {
        font-size: 1.8rem;
        margin-bottom: 8px;
        color: #16213e;
      }
      p.subtitle {
        color: #6c757d;
        margin-bottom: 24px;
        font-size: 0.9rem;
      }
      .stats {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        font-size: 0.85rem;
        color: #495057;
      }
      .stats span {
        background: #e9ecef;
        padding: 4px 12px;
        border-radius: 12px;
      }
      .input-row {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }
      .input-row input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        font-size: 1rem;
        outline: none;
      }
      .input-row input:focus {
        border-color: #4361ee;
        box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
      }
      .input-row button {
        padding: 10px 20px;
        background: #4361ee;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
      }
      .input-row button:hover {
        background: #3a56d4;
      }
      ul {
        list-style: none;
      }
      li {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        background: #fff;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        margin-bottom: 8px;
        transition: box-shadow 0.2s;
      }
      li:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }
      li input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: #4361ee;
        cursor: pointer;
      }
      li .todo-text {
        flex: 1;
        font-size: 0.95rem;
      }
      li .todo-text.done {
        text-decoration: line-through;
        color: #adb5bd;
      }
      li .todo-actions {
        display: flex;
        gap: 6px;
      }
      li button {
        padding: 4px 10px;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        font-size: 0.8rem;
        cursor: pointer;
        background: #fff;
        transition: all 0.2s;
      }
      li button:hover {
        background: #f1f3f5;
      }
      li button.danger {
        color: #e63946;
        border-color: #f8d7da;
      }
      li button.danger:hover {
        background: #fff5f5;
      }
      .empty-state {
        text-align: center;
        padding: 40px 0;
        color: #adb5bd;
      }
      .footer-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
      }
      .footer-actions button {
        padding: 8px 16px;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        font-size: 0.85rem;
        cursor: pointer;
        background: #fff;
        transition: all 0.2s;
      }
      .footer-actions button:hover {
        background: #f1f3f5;
      }
      .footer-actions button.danger {
        color: #e63946;
      }
      #status {
        margin-top: 16px;
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 0.85rem;
        display: none;
      }
      #status.error {
        display: block;
        background: #fff5f5;
        color: #e63946;
        border: 1px solid #f8d7da;
      }
      #status.success {
        display: block;
        background: #f0fff4;
        color: #2d6a4f;
        border: 1px solid #d8f5e6;
      }
    </style>
  </head>
  <body>
    <h1>📋 ctrodb Todo</h1>
    <p class="subtitle">
      Client-side database — all data stays in your browser.
    </p>

    <div class="stats">
      <span id="total-count">Total: 0</span>
      <span id="done-count">Done: 0</span>
    </div>

    <div class="input-row">
      <input
        type="text"
        id="new-todo-input"
        placeholder="What needs to be done?"
        autofocus
      />
      <button id="add-btn">Add</button>
    </div>

    <ul id="todo-list">
      <li class="empty-state">No todos yet. Add one above!</li>
    </ul>

    <div class="footer-actions">
      <button id="clear-done-btn">Clear Done</button>
      <button id="reset-btn" class="danger">Reset All</button>
    </div>

    <div id="status"></div>

    <script src="https://unpkg.com/ctrodb@1.0.1/dist/index.global.js"></script>

    <script>
      const { Database } = CtroDB;

      let db;
      let todos;

      async function init() {
        db = new Database({
          name: "todo-app",
          adapter: "indexeddb",
          schema: {
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
          },
        });

        try {
          await db.connect();
          todos = db.collection("todos");
          render();
        } catch (err) {
          showStatus("Failed to connect: " + err.message, "error");
        }
      }

      async function render() {
        try {
          const all = await todos.query().sort({ createdAt: "desc" }).fetch();
          const total = all.length;
          const done = all.filter((t) => t.done).length;

          document.getElementById("total-count").textContent =
            "Total: " + total;
          document.getElementById("done-count").textContent = "Done: " + done;

          const list = document.getElementById("todo-list");
          if (total === 0) {
            list.innerHTML =
              '<li class="empty-state">No todos yet. Add one above!</li>';
            return;
          }

          list.innerHTML = all
            .map((todo) => {
              const textClass = todo.done ? "todo-text done" : "todo-text";
              return `<li data-id="${todo.id}">
            <input type="checkbox" ${todo.done ? "checked" : ""} />
            <span class="${textClass}">${escapeHtml(todo.text)}</span>
            <div class="todo-actions">
              <button class="delete-btn danger">Delete</button>
            </div>
          </li>`;
            })
            .join("");

          list.querySelectorAll("input[type='checkbox']").forEach((cb, i) => {
            cb.addEventListener("change", async () => {
              const todo = all[i];
              if (todo) {
                await todo.update({ done: cb.checked });
                render();
              }
            });
          });

          list.querySelectorAll(".delete-btn").forEach((btn, i) => {
            btn.addEventListener("click", async () => {
              const todo = all[i];
              if (todo) {
                await todo.delete();
                render();
              }
            });
          });
        } catch (err) {
          showStatus("Error: " + err.message, "error");
        }
      }

      document.getElementById("add-btn").addEventListener("click", async () => {
        const input = document.getElementById("new-todo-input");
        const text = input.value.trim();
        if (!text) return;

        try {
          await todos.create({ text, done: false, createdAt: Date.now() });
          input.value = "";
          input.focus();
          render();
        } catch (err) {
          showStatus("Failed to add todo: " + err.message, "error");
        }
      });

      document
        .getElementById("new-todo-input")
        .addEventListener("keydown", (e) => {
          if (e.key === "Enter") document.getElementById("add-btn").click();
        });

      document
        .getElementById("clear-done-btn")
        .addEventListener("click", async () => {
          try {
            const doneItems = await todos
              .query()
              .where("done", "==", true)
              .fetch();
            for (const item of doneItems) await item.delete();
            render();
            showStatus(
              "Cleared " + doneItems.length + " completed todo(s).",
              "success",
            );
          } catch (err) {
            showStatus("Error: " + err.message, "error");
          }
        });

      document
        .getElementById("reset-btn")
        .addEventListener("click", async () => {
          if (!confirm("Delete all todos?")) return;
          try {
            const all = await todos.getAll();
            await todos.deleteMany(all.map((t) => t.id));
            render();
            showStatus("All todos deleted.", "success");
          } catch (err) {
            showStatus("Error: " + err.message, "error");
          }
        });

      function showStatus(msg, type) {
        const el = document.getElementById("status");
        el.textContent = msg;
        el.className = type;
        setTimeout(() => {
          el.className = "";
          el.style.display = "none";
        }, 3000);
      }

      function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
      }

      init();
    </script>
  </body>
</html>
```

Save it as `todo.html` and open it in any browser.

## What you can do with it

- **Add** — type a task and press Enter or click Add
- **Complete** — check the box, text gets a strikethrough
- **Delete** — click the red Delete button on any todo
- **Clear Done** — removes all completed todos in one click
- **Reset** — deletes everything (with a confirmation prompt)
- **Stats** — Total and Done counts update on every change
- **Persistence** — close and reopen the file, your todos are still there

Everything is stored in IndexedDB via ctrodb. No server, no API, no database setup.

---

_This is the official ctrodb CDN example. Try the browser playground at https://ctrodb.vercel.app/playground. GitHub: https://github.com/ctrotech-tutor/ctrodb. Docs: https://ctrodb.vercel.app/docs/examples/cdn-todo._
