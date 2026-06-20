## Reddit (r/typescript) — OG Card

**Aspect ratio:** 1200×630

**Concept:** A TypeScript code editor showing auto-completion on a ctrodb query. The cursor is at "users.query().where(" and a dropdown shows the available field names. Demonstrate type inference.

**Composition:**
- Full card: VS Code editor window
- Code:
  ```
  const users = db.collection("users")
  const results = await users.query()
    .where("
  ```
- Auto-complete dropdown showing: "name" | "email" | "role" | "createdAt" with their types
- TypeScript blue logo in the top-right

**Style:** VS Code screenshot with a focus on the autocomplete dropdown. Very detailed, realistic.

**Colors:** VS Code dark theme (#1e1e2e), TypeScript blue (#3178c6) for the logo, autocomplete dropdown with white background and selected item in light blue.

**Technical notes:** Export as PNG. This image needs to look like a real VS Code screenshot. Use actual VS Code font (Cascadia Code or Fira Code) if possible via mockup.
