## X Post 5 — React Hooks

**Aspect ratio:** 1200×675

**Concept:** A React component shown side-by-side with its reactive data flow. Left side shows useQuery hook, right side shows the rendered UI. An arrow between them shows the reactive update path.

**Composition:**
- Left 50%: code editor showing:
  ```
  const todos = useQuery("todos",
    (q) => q.sort({createdAt:"desc"})
  )
  ```
- Right 50%: a rendered todo list with 3 items, checkboxes
- Between them: a glowing arrow or pulse animation indicator showing "reactive"

**Style:** Split screen. Code editor on left, browser window mockup on right.

**Colors:** Dark editor (#1e1e2e) on left, light browser window (#f8fafc) on right. Reactive indicator in cyan (#06b6d4). Checkboxes in green (#22c55e) for done items.

**Technical notes:** Export as PNG. The code should be large enough to read — use at least 20px font in the mockup.
