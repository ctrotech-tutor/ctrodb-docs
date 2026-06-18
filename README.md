# ctrodb docs

Documentation site for [ctrodb](https://github.com/ctrotech-tutor/ctrodb) — a reactive, schema-driven client-side database for TypeScript.

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
  docs/        ← Documentation pages (33 MDX files)
    meta.json  ← Sidebar navigation order
  blog/        ← Blog posts (5 MDX files)
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

Generates ~45 static pages (SSG) + OG image route (edge).

## Deployment

Auto-deploys to [ctrodb.vercel.app](https://ctrodb.vercel.app) on push to `main`.
