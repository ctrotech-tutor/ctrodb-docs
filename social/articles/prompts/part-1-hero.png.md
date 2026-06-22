## Part 1 — Your First ctrodb App / Hero Image

**Aspect ratio:** 1200×630 (OG card)

**Concept:** Split code editor view. Left pane shows schema definition, right pane shows CRUD operations. A "Part 1 of 5" badge in the top-right. Dev.to series hero aesthetic.

**Logo:** Top-left corner. ctrodb wordmark (user uploads the logo file separately).

**Composition:**
- Full background: dark editor theme (#1e1e2e) with subtle line-number gutters on both panes, 5% opacity
- Center vertical divider: thin cyan line (#06b6d4), 1px, running full height
- Left pane (48%): 8-10 lines of monospace text suggesting schema definition. First lines have syntax in cyan/blue. The code should look like `fields: { title: { type: "string" } }` with colored keys and values
- Right pane (48%): 8-10 lines suggesting CRUD operations. First line `await db.connect()` in green, then `collection("notes")`, `.create()`, `.query()...fetch()` in white with cyan highlights
- Top-right corner: small rounded badge "Part 1 of 5" in amber (#f59e0b) fill, white text, 12px padding
- Bottom area spanning both panes: thin horizontal line in slate-600 (#475569), 80% width centered

**Colors:** Background #1e1e2e, syntax strings green (#22c55e), keywords cyan (#06b6d4), variables white (#f8fafc), comments slate-500 (#64748b), divider cyan (#06b6d4), badge amber (#f59e0b).

**Typography:** Code in 14px monospace (JetBrains Mono or Fira Code) with typical editor syntax highlighting. Badge in 11px bold sans-serif.

**Technical notes:** 1200×630. Logo top-left (user uploads separately). The AI should NOT render perfectly legible code — just suggest the structure with realistic code-like lines and proper syntax coloring. The editor should look like VS Code but simplified (no sidebar, no status bar, just the two panes).
