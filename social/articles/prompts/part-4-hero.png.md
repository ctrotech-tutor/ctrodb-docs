## Part 4 — Relations and Schema Design / Hero Image

**Aspect ratio:** 1200×630

**Concept:** Entity-relationship diagram showing three collections (Users, Posts, Comments) in a triangle layout. Each collection box shows typed fields. Relation lines with "has_many" / "belongs_to" labels connect them. Clean architectural ERD.

**Logo:** Top-left corner. ctrodb wordmark (user uploads the logo file separately).

**Composition:**
- Full background: light warm white (#fafaf9), not dark — this one uses a light theme for an architectural/blueprint feel
- Three card boxes arranged in a triangle (User top-center, Posts bottom-left, Comments bottom-right). Each card:
  - White fill (#ffffff), rounded corners (8px), thin border (#e2e8f0), subtle shadow (0 2px 8px rgba(0,0,0,0.06))
  - Top of card: collection name in 16px bold sans-serif (#1a1a2e)
  - Below: 3-4 typed fields in 12px monospace. Field names in dark (#334155), types in small colored badges: `string` in blue (#3b82f6) bg, `number` in amber (#f59e0b) bg, `boolean` in green (#22c55e) bg, `relation` in purple (#a855f7) bg
- Relation lines between cards:
  - User → Posts: arrow with label "has_many :posts" in 12px slate-500
  - Posts → Comments: arrow with label "has_many :comments" in 12px slate-500
  - Comments → User: arrow with label "belongs_to :user" in 12px slate-500
  - Lines are warm gray (#94a3b8), 1.5px, with small arrowheads
- Top area: headline "Schema Design & Relations" in dark (#1a1a2e) sans-serif, 28pt, left-aligned with 60px margin
- Bottom-right: small rounded badge "Part 4 of 5" in purple (#a855f7) fill, white text
- Bottom-left: subtle database cylinder icon in slate-300 (#cbd5e1) at 30% opacity

**Colors:** Background #fafaf9, cards white #ffffff, card borders #e2e8f0, text dark #1a1a2e, field names #334155, type badges blue #3b82f6 / amber #f59e0b / green #22c55e / purple #a855f7, relation lines #94a3b8, badge purple #a855f7.

**Typography:** Headline 28pt bold sans-serif, card titles 16pt bold sans-serif, field names 12px monospace, badges 10px bold sans-serif, relation labels 12px sans-serif. Clean, architectural feel.

**Technical notes:** 1200×630. Logo top-left (user uploads separately). This one uses a light background — different from the other dark-themed cards. The relation lines should clearly show direction with arrowheads. The triangle layout should feel balanced, not cramped. Cards should be about 200px wide each.
