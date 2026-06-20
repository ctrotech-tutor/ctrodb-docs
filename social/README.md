# ctrodb Launch Kit

Everything needed to launch ctrodb — a zero-dependency, reactive, client-side database for TypeScript.

## Directory structure

```
social/
  README.md
  devto/          5 standalone articles for Dev.to
  x/              Individual posts for X/Twitter
  hacker-news/    Show HN post
  reddit/         Posts for r/typescript, r/webdev, r/javascript
  product-hunt/   Product Hunt launch page
  instagram/      Carousel post + caption
  youtube/        Community post announcement
```

Each platform directory has its own `prompts/` folder with image generation prompts for a graphic designer.

## Launch order

1. **Product Hunt** — launch page goes live
2. **Hacker News** — Show HN post (1 hour after PH)
3. **Reddit** — r/typescript, r/webdev, r/javascript (2-3 hours apart)
4. **X/Twitter** — individual posts throughout the day
5. **Dev.to** — one article every 3-4 days starting 3 days after launch
6. **Instagram** — carousel post (same day as first Dev.to article)
7. **YouTube** — community post (same day as launch)

## Key links

- GitHub: https://github.com/ctrotech-tutor/ctrodb
- npm: `npm install ctrodb`
- Docs: https://ctrodb.vercel.app/docs
- Playground: https://ctrodb.vercel.app/playground
