---
target: "client-side-databases-are-underrated"
commenter: "Christian"
topic: "conflict resolution / sync"
date: 2026-06-21
---

**Reply:**

Fair question. You're right that "sync to server" is doing a lot of work in that one-liner — and conflict resolution is exactly where local-first stops being a neat idea and becomes an engineering problem.

ctrodb doesn't take a position on conflicts. Right now it's scoped to the client side — single-device scenarios where there's no sync to worry about. The primary use case is apps where data lives and dies on one device: form drafts, search indexes, UI preferences, prototypes, tools that don't need multi-device access.

For the cases where you do sync, ctrodb exposes the underlying records as plain objects with timestamps, so you can layer your own strategy on top. Last-write-wins is the simplest option if you're OK with the data loss. For proper local-first, you'd want CRDTs or an operation log on top — Automerge, Yjs, or a custom revision system. That's a separate concern that the library doesn't try to solve.

It's definitely a gap. If local-first multi-device sync is a requirement, ctrodb alone won't cover it yet. A sync plugin is on the roadmap — something that tracks changesets and lets you plug in a conflict strategy (LWW, CRDT, or custom). Not built yet, but it's where the library is heading.

Appreciate the honest question. That's exactly the kind of feedback that shapes what gets built next.
