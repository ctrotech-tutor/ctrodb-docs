## Part 3 — Full-Text Search / Hero Image

**Aspect ratio:** 1200×630

**Concept:** A search pipeline flowing top-to-bottom. Documents enter at the top, pass through tokenization, enter an inverted index (visualized as a table), then ranked results exit at the bottom. Technical diagram style.

**Logo:** Top-left corner. ctrodb wordmark (user uploads the logo file separately).

**Composition:**
- Full background: dark slate (#0f172a) with a very faint dot grid at 4% opacity
- Top section: 3 document rectangles (amber #f59e0b at 30% fill, thin amber borders) arranged horizontally with small text lines inside suggesting content
- Below documents (60px gap): a down arrow in cyan (#06b6d4) labeled "tokenize" in 11px slate-400 on the left
- Middle section: inverted index table. Rectangular panel (#1e293b) with cyan border (#06b6d4 at 60%). Two columns inside: "Token" (header in white bold) and "Docs" (header in white bold). Data rows in monospace: `react → [1,3,7]`, `hooks → [7,12]`, `typescript → [1,5]` in cyan (#06b6d4). The table has subtle horizontal dividers between rows (#334155).
- Below table (60px gap): a down arrow in cyan labeled "intersect" in 11px slate-400 on the left
- Bottom section: 3 ranked result rectangles stacked vertically. Top result has a cyan left border and subtle glow. Each has a rank number (1, 2, 3) in small cyan text on the left and horizontal text lines suggesting content.
- Bottom-right corner: small rounded badge "Part 3 of 5" in amber (#f59e0b) fill, white text

**Colors:** Background #0f172a, documents amber #f59e0b at 30%, table panel #1e293b, table border #06b6d4 at 60%, table rows #334155, token text cyan #06b6d4, headers white #f8fafc, arrows #06b6d4, labels #94a3b8, badge amber #f59e0b.

**Typography:** Table headers in 13px bold sans-serif, table data in 13px monospace (JetBrains Mono or Fira Code), labels in 11px sans-serif, badge in 11px bold sans-serif. Headline not needed — the visual tells the story.

**Technical notes:** 1200×630. Logo top-left (user uploads separately). The inverted index table should look like a real data structure visualization — aligned columns, clean rows, monospace. The arrows should be simple chevron shapes, not ornate. The document rectangles should suggest text content without rendering real words.
