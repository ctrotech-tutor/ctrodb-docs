## Reddit (r/webdev) — OG Card

**Aspect ratio:** 1200×630

**Concept:** A "before and after" comparison. Left side: raw IndexedDB code (open request, onupgradeneeded, transaction, objectStore — about 20 lines). Right side: the same operation in ctrodb (3 lines). A red "X" over the left side, a green checkmark over the right.

**Composition:**
- Left 50%: raw IndexedDB boilerplate code in a red-tinted editor window
- Center: a red X and green checkmark stacked vertically, or a VS code arrow
- Right 50%: ctrodb code in a green-tinted editor window
- Left side shows frustration (tangled wire icon), right side shows relief (clean database icon)

**Style:** Side-by-side comparison. Split screen with color coding.

**Colors:** Left editor tinted red (#450a0a background), right editor tinted green (#052e16 background). Code in white/gray on both sides. X in red (#ef4444), checkmark in green (#22c55e).

**Technical notes:** Export as PNG. The IndexedDB code should look convincingly long and ugly. The ctrodb code should look clean and short.
