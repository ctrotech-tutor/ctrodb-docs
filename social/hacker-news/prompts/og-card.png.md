## Hacker News — Show HN / OG Card

**Aspect ratio:** 1200×630 (OG card)

**Concept:** A code editor window showing the ctrodb "hello world" example. The editor has a "Show HN" badge in the top-left corner. Clean, dark theme.

**Composition:**
- Full card: code editor window (dark theme) with window controls (red/yellow/green dots) in top-left
- Instead of the badge, use an "HN" logo or text badge in the top-right corner
- Code shown:
  ```typescript
  import { Database } from "ctrodb"
  const db = new Database({ name: "hello" })
  await db.connect()
  const col = db.collection("items")
  await col.create({ text: "Hello, HN!" })
  ```
- Subtle terminal-style cursor blink at the end

**Style:** VS Code / Warp terminal aesthetic. Dark, clean, developer-focused.

**Colors:** Editor background #1e1e2e, title bar #181825, syntax colors: import/keyword in purple (#cba6f7), string in green (#a6e3a1), ctrodb in pink (#f5c2e7). HN badge background #ff6600 with white text.

**Technical notes:** Export as PNG. The code must be large enough to read at OG card scale (~600px width). Consider using a larger font than typical code screenshots.
