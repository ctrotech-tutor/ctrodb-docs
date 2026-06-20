## X Post 6 — Relations

**Aspect ratio:** 1200×675

**Concept:** Two model cards connected by a line labeled "has_many". A user card on the left expands to show its posts relationship. A callout shows the lazy vs eager loading difference.

**Composition:**
- Left: "User" card (name, email fields), with a small expand arrow
- Right: "Post" card (title, body fields), slightly smaller/nested
- Connecting line: "has_many" label
- Bottom left callout: "Lazy: user.posts.fetch()" 
- Bottom right callout: "Eager: .with('posts')"

**Style:** Entity relationship diagram with modern card UI. Clean, minimal.

**Colors:** Background slate (#1e293b), User card in blue (#3b82f6), Post card in purple (#a855f7), connecting line white (#e2e8f0). Callout boxes in dark slate with white text.

**Technical notes:** Export as PNG. The relationship direction should be clear — User has_many Posts, Post belongs_to User.
