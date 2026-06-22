---
title: "Build a Notes App with ctrodb, Tailwind CSS, and Vanilla JavaScript"
description: "A hands-on tutorial: build a fully functional notes app with search, pinning, and persistence — entirely in the browser, no backend required."
tags: [javascript, tutorial, html, database]
---

Let's build a notes app that runs entirely in the browser. Create, pin, search, and delete notes — all persisted to IndexedDB. No backend, no build step, no npm install.

We'll use ctrodb for the database, Tailwind CSS for styling, and vanilla JavaScript for the glue.

## What we're building

A single HTML file with:
- Add notes with title, body, and tags
- Pin important notes to the top
- Search notes by title
- Delete notes
- Persistence across page reloads
- Dark mode UI

## Setting up

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ctrodb Notes</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen p-4 sm:p-6">
```

ctrodb ships as an IIFE that exposes a `CtroDB` global:

```html
<script src="https://unpkg.com/ctrodb@1.0.1/dist/index.global.js"></script>
<script>
  const { Database } = CtroDB
```

No bundler, no build step, no npm install.

## Schema design

```javascript
const schema = {
  version: 1,
  collections: {
    notes: {
      fields: {
        title: { type: "string", required: true },
        body: { type: "string", default: "" },
        tags: { type: "array", items: { type: "string" }, default: [] },
        pinned: { type: "boolean", default: false },
        createdAt: { type: "string", default: () => new Date().toISOString() },
      },
      indexes: [
        { field: "createdAt" },
        { field: "pinned" },
      ],
    },
  },
}
```

The schema validates every write. A note without a title throws a `ValidationError`. Defaults fill in missing fields.

## Connecting

```javascript
const db = new Database({ name: "notes-app", schema })
await db.connect()
const notes = db.collection("notes")
```

## Rendering notes

Each note card carries its own id directly in the markup via a `data-id` attribute:

```javascript
function noteCard(note) {
  const isPinned = note.pinned
  return `
    <div class="bg-gray-800 rounded-lg p-4 border ..." data-id="${note.id}">
      <h3>${escapeHtml(note.title)}</h3>
      <button class="pin-btn ...">${isPinned ? "\u2605" : "\u2606"}</button>
      <button class="delete-btn ...">\u2715</button>
    </div>
  `
}

async function render(message) {
  const query = document.getElementById("search").value.trim()
  const list = query
    ? await notes.query().search("title", query).fetch()
    : await notes.query().sort({ pinned: "desc", createdAt: "desc" }).fetch()

  if (list.length === 0) {
    container.innerHTML = `<p>${message || "No notes yet."}</p>`
    return
  }

  container.innerHTML = list.map(noteCard).join("")
}
```

Notice `render()` only builds HTML — it doesn't attach any click handlers. That's deliberate, and it's the key to the next section.

## Wiring up pin and delete with event delegation

A common first instinct is to attach a click listener to every `.pin-btn` and `.delete-btn` right after rendering, capturing the note from the `list` array by index:

```javascript
// Don't do this — see below for why
container.querySelectorAll(".pin-btn").forEach((btn, i) => {
  btn.addEventListener("click", async () => {
    const note = list[i]
    await note.update({ pinned: !note.pinned })
    await render()
  })
})
```

This works at first glance, but it has two real problems. Every call to `render()` re-attaches a fresh batch of listeners on top of whatever's still pending from the previous render, and the handler closes over the `list` array by position — so if a search or sort ever reorders things between render and click, the index can point at the wrong note.

The more robust pattern is **event delegation**: attach a single listener to the container once, and read the note's id off the clicked card's `data-id` attribute at click time.

```javascript
container.addEventListener("click", async (e) => {
  const card = e.target.closest("[data-id]")
  if (!card) return
  const id = Number(card.dataset.id)

  if (e.target.closest(".pin-btn")) {
    const note = await notes.get(id)
    if (note) {
      await note.update({ pinned: !note.pinned })
      await render()
    }
    return
  }

  if (e.target.closest(".delete-btn")) {
    await notes.delete(id)
    await render()
  }
})
```

One listener, attached once in `init()`, handles every note — present and future — since clicks bubble up to `container` regardless of how many times `innerHTML` gets replaced.

### The one gotcha: `dataset.id` is always a string

This is the part that trips people up, so it's worth calling out explicitly. `element.dataset.id` always returns a **string** — `"1"`, `"2"`, and so on — because HTML attributes are text. But ctrodb's default browser adapter is IndexedDB, and with `keyPath: "id", autoIncrement: true`, the ids it actually stores are **numbers**.

IndexedDB key lookups are type-sensitive: the string `"1"` and the number `1` are different keys. So `notes.get(card.dataset.id)` silently fails to find anything — no error, no thrown exception, just an `undefined` result that your `if (note)` guard quietly swallows. From the UI, it just looks like the pin and delete buttons don't do anything.

The fix is the `Number(...)` call above:

```javascript
const id = Number(card.dataset.id)
```

Easy to miss, easy to fix, and a good reminder that anything pulled from `dataset` needs to be coerced back to its real type before you use it as a database key.

## Adding notes

```javascript
document.getElementById("add-note-btn").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim()
  const body = document.getElementById("body").value.trim()
  const tags = document.getElementById("tags").value
    .split(",").map(t => t.trim()).filter(Boolean)

  if (!title) { alert("Title is required."); return }

  await notes.create({ title, body, tags })
  clearForm()
  await render()
})
```

## Search

A 200ms debounce avoids excessive queries:

```javascript
let searchTimer
document.getElementById("search").addEventListener("input", () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => render(), 200)
})
```

`query().search("title", query)` does case-insensitive substring matching.

## Complete code

Here's the full HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ctrodb Notes</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { darkMode: "class" }
  </script>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen p-4 sm:p-6">
  <div class="max-w-2xl mx-auto">

    <h1 class="text-3xl font-bold mb-8 flex items-center gap-3">
      <span class="text-blue-400">&#9670;</span>
      ctrodb Notes
    </h1>

    <!-- Search -->
    <div class="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
      <input
        id="search"
        type="text"
        placeholder="Search notes by title..."
        class="w-full bg-gray-700 rounded px-3 py-2 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>

    <!-- New Note Form -->
    <div class="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
      <h2 class="font-semibold mb-3 text-gray-300">New Note</h2>
      <input
        id="title"
        type="text"
        placeholder="Title (required)"
        required
        class="w-full bg-gray-700 rounded px-3 py-2 mb-3 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
      />
      <textarea
        id="body"
        placeholder="Body (optional)"
        rows="3"
        class="w-full bg-gray-700 rounded px-3 py-2 mb-3 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
      ></textarea>
      <input
        id="tags"
        type="text"
        placeholder="Tags (comma-separated)"
        class="w-full bg-gray-700 rounded px-3 py-2 mb-3 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
      />
      <button
        id="add-note-btn"
        class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium transition-colors"
      >
        + Add Note
      </button>
    </div>

    <!-- Notes List -->
    <div id="notes-container" class="space-y-3"></div>

  </div>

  <script src="https://unpkg.com/ctrodb@1.0.1/dist/index.global.js"></script>
  <script>
  const { Database } = CtroDB

  const schema = {
    version: 2,
    collections: {
      notes: {
        fields: {
          title: { type: "string", required: true },
          body: { type: "string", default: "" },
          tags: { type: "array", items: { type: "string" }, default: [] },
          pinned: { type: "boolean", default: false },
          createdAt: { type: "string", default: () => new Date().toISOString() },
        },
        indexes: [
          { field: "createdAt" },
          { field: "pinned" },
        ],
      },
    },
  }

  let db, notes, container

  function escapeHtml(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
  }

  function noteCard(note) {
    const isPinned = note.pinned
    return `
      <div class="bg-gray-800 rounded-lg p-4 border transition-colors ${isPinned ? "border-yellow-500/60" : "border-gray-700"}" data-id="${note.id}">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-lg truncate">${escapeHtml(note.title)}</h3>
            ${note.body ? `<p class="text-gray-400 mt-1 line-clamp-3">${escapeHtml(note.body)}</p>` : ""}
            ${note.tags.length ? `
              <div class="flex flex-wrap gap-2 mt-3">
                ${note.tags.map(t => `<span class="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">${escapeHtml(t)}</span>`).join("")}
              </div>
            ` : ""}
            <p class="text-xs text-gray-500 mt-3">${new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
          <div class="flex gap-1 shrink-0">
            <button class="pin-btn p-1.5 rounded hover:bg-gray-700 transition-colors ${isPinned ? "text-yellow-400" : "text-gray-500 hover:text-yellow-400"}" title="${isPinned ? "Unpin" : "Pin"}">
              ${isPinned ? "\u2605" : "\u2606"}
            </button>
            <button class="delete-btn p-1.5 rounded hover:bg-gray-700 text-gray-500 hover:text-red-400 transition-colors" title="Delete">\u2715</button>
          </div>
        </div>
      </div>
    `
  }

  function clearForm() {
    document.getElementById("title").value = ""
    document.getElementById("body").value = ""
    document.getElementById("tags").value = ""
  }

  async function render(message) {
    const query = document.getElementById("search").value.trim()
    const list = query
      ? await notes.query().search("title", query).fetch()
      : await notes.query().sort({ pinned: "desc", createdAt: "desc" }).fetch()

    if (list.length === 0) {
      container.innerHTML = `<p class="text-gray-500 text-center py-8">${message || (query ? "No notes match your search." : "No notes yet. Create one above!")}</p>`
      return
    }

    container.innerHTML = list.map(noteCard).join("")
  }

  async function init() {
    db = new Database({ name: "notes-app", schema })
    await db.connect()
    notes = db.collection("notes")
    container = document.getElementById("notes-container")

    // Add note
    document.getElementById("add-note-btn").addEventListener("click", async () => {
      const title = document.getElementById("title").value.trim()
      const body = document.getElementById("body").value.trim()
      const rawTags = document.getElementById("tags").value

      if (!title) { alert("Title is required."); return }

      const tags = rawTags.split(",").map(t => t.trim()).filter(Boolean)
      await notes.create({ title, body, tags })
      clearForm()
      await render()
    })

    // Search with debounce
    let searchTimer
    document.getElementById("search").addEventListener("input", () => {
      clearTimeout(searchTimer)
      searchTimer = setTimeout(() => render(), 200)
    })

    // Event delegation for pin and delete
    container.addEventListener("click", async (e) => {
      const card = e.target.closest("[data-id]")
      if (!card) return
      const id = Number(card.dataset.id)

      if (e.target.closest(".pin-btn")) {
        const note = await notes.get(id)
        if (note) {
          await note.update({ pinned: !note.pinned })
          await render()
        }
        return
      }

      if (e.target.closest(".delete-btn")) {
        await notes.delete(id)
        await render()
      }
    })

    await render()
  }

  init()
  </script>
</body>
</html>
```

Save it as `notes.html` and open it in any browser. Add notes, pin them, search, delete — all operations work with full IndexedDB persistence.

## What's happening

- ctrodb connects to IndexedDB, creates the `notes-app` database
- The schema validates every write — wrong types or missing required fields throw
- `query().search("title", query)` does case-insensitive substring matching
- A single delegated click listener on `#notes-container` handles pin and delete for every note, current and future — no listeners to re-attach on each render
- Ids read from `data-id` are coerced with `Number(...)` before being passed back to ctrodb, since IndexedDB's autoincrement keys are numeric but `dataset` values are always strings
- Everything runs in-process — no network requests, no server

Try the browser playground at https://ctrodb.vercel.app/playground.

---

_ctrodb is open source. GitHub: https://github.com/ctrotech-tutor/ctrodb. Docs: https://ctrodb.vercel.app/docs/getting-started/quick-start._
