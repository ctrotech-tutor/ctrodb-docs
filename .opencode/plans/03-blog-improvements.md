# Phase 3: Blog Improvements

**Note:** This phase requires discussion before implementation. Below are the areas identified for discussion.

## Current state
- 5 blog posts with listing page and individual post pages
- Post pages have author, date, tags, prev/next navigation
- No share buttons, no feedback, no TOC

## Proposed improvements

### 1. Share + feedback on blog posts
`DocShare` and `DocFeedback` already exist as components. Wire them into `app/blog/[slug]/page.tsx`:
- Share button (copy link + Web Share API)
- "Was this helpful?" thumbs up/down → `/api/doc-feedback` with `type: "blog"`

### 2. Table of contents
Blog posts don't have a TOC sidebar. Add one using the same `extractTOC()` / `TableOfContents` approach as doc pages.

### 3. Reading time estimate
Each post displays estimated reading time based on word count (average 200 wpm).

### 4. Related posts
Show 2-3 related posts at the bottom based on shared tags.

## Discussion points
- Should blog feedback go to the same API as doc feedback? (separate `type` field?)
- Should blog posts get the full doc layout (sidebar, TOC) or keep the current clean/simple layout?
- Should we add social sharing buttons (Twitter, LinkedIn) in addition to plain link share?
- RSS feed for blog?
