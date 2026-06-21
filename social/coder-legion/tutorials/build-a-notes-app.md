---
title: "Build a Notes App with ctrodb, Tailwind CSS, and Vanilla JavaScript"
tags: [javascript, tutorial, html, tailwind-css, database]
---

Let's build a notes app that runs entirely in the browser. Create, pin, search, and delete notes — all persisted to IndexedDB. No backend, no build step.

We'll use ctrodb for the database, Tailwind CSS for styling, and vanilla JavaScript for the glue.

## Schema

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

The schema validates every write. A note without a title throws. Defaults fill in missing fields.

## Connecting

```javascript
const db = new Database({ name: "notes-app", schema })
await db.connect()
const notes = db.collection("notes")
```

## Rendering notes

Each note card carries its own id in a `data-id` attribute. Click handlers are attached once via event delegation — no re-attaching on every render.

```javascript
function noteCard(note) {
  return `
    <div class="bg-gray-800 rounded-lg p-4 border ..." data-id="${note.id}">
      <h3>${escapeHtml(note.title)}</h3>
      <button class="pin-btn ...">${note.pinned ? "\u2605" : "\u2606"}</button>
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

## Event delegation for pin and delete

A single listener on the container catches clicks from every card, present and future. We read the note's id from `data-id` and coerce it with `Number()` — IndexedDB stores numeric ids, but `dataset.id` returns a string.

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

## Adding notes and search

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

Search uses `query().search("title", query)` — case-insensitive substring matching. A 200ms debounce avoids excessive queries:

```javascript
let searchTimer
document.getElementById("search").addEventListener("input", () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => render(), 200)
})
```

## Full code

The complete HTML file is in the ctrodb examples on GitHub. Save it as `notes.html` and open in any browser. Add notes, pin them, search, delete — all persisted to IndexedDB.
