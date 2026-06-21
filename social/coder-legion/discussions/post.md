---
title: "What do you use for client-side storage?"
tags: [discussion, javascript, database, webdev]
---

I've been working on a client-side database called ctrodb, and it got me thinking about how other developers handle local storage.

What do you reach for when you need to keep data in the browser?

- localStorage (simple but synchronous and limited to strings)
- IndexedDB directly (powerful but verbose)
- Dexie (IndexedDB wrapper)
- Zustand or Redux (in-memory only, lost on refresh)
- Something else?

I went with IndexedDB wrapped in a schema-driven API. The library handles validation, queries, and change events so I don't have to write the same boilerplate every time.

Curious what pain points you've hit with client-side storage — migrations, size limits, cross-tab issues, performance? What would make your life easier?
