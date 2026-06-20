## X Post 3 — Queries

**Aspect ratio:** 1200×675

**Concept:** A chained method call visualized as a flowchart. Each method (query, where, sort, limit, fetch) is a box with an arrow to the next, and the final result is a data table.

**Composition:**
- Top: starting code: items.query()
- Chain: → where("price", "<", 100) → sort({ name: "asc" }) → limit(20)
- Final: fetch() → a small table showing 3 rows of results
- Each method box is color-coded and has a tiny description

**Style:** Flowchart meets code card. Clean, methodical.

**Colors:** Method boxes in different pastel colors (amber for query, blue for where, green for sort, purple for limit, cyan for fetch). Background white (#f8fafc).

**Technical notes:** Export as PNG. The chain should be horizontal, not vertical, to fit the X card aspect ratio.
