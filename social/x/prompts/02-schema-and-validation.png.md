## X Post 2 — Schema and Validation

**Aspect ratio:** 1200×675

**Concept:** A code snippet showing a ctrodb schema definition, with validation error indicators (red squiggles) on the right side showing what gets caught at write time.

**Composition:**
- Left 70%: code editor window showing:
  ```
  const schema = {
    collections: {
      users: {
        fields: {
          email: { type: "string", validate: "email" }
  ```
- Right 30%: a callout showing caught errors: "email: invalid format" , "name: required"
- A shield icon in the top-right corner

**Style:** Code editor mockup with clean syntax highlighting. Dark theme.

**Colors:** Editor background #1e1e2e, syntax highlighting (purple for types, green for strings, blue for keywords), error red (#ef4444), shield green (#22c55e).

**Technical notes:** Export as PNG. Text must be large enough to read on mobile — at least 24px equivalent.
