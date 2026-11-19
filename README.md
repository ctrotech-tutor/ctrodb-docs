# ctrodb docs

Documentation site for [ctrodb](https://github.com/ctrotech-tutor/ctrodb) — a reactive, schema-driven client-side database for TypeScript. The current documented library release is **1.13.2**.

Built with [Next.js](https://nextjs.org), [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote), and [shadcn/ui](https://ui.shadcn.com).

## Stack

- **Framework**: Next.js 16 (App Router)
- **Content**: MDX with `next-mdx-remote` + `gray-matter`
- **UI**: shadcn/ui (Radix Nova)
- **Styling**: Tailwind CSS 4 + `@tailwindcss/typography`
- **Code highlighting**: rehype-pretty-code + shiki
- **Theme**: next-themes (dark/light mode)

## Content

```
content/
  v1/docs/     ← Version 1 documentation pages (50 MDX files)
    meta.json  ← Sidebar navigation order
  blog/        ← Blog posts (13 MDX files)
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Generates the static documentation and blog pages, plus the Open Graph image route.

## Deployment

Auto-deploys to [ctrodb.vercel.app](https://ctrodb.vercel.app) on push to `main`.
