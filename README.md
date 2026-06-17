# ctrodb docs

Documentation site for [ctrodb](https://github.com/ctrotech-tutor/ctrodb) — a reactive, schema-driven client-side database for TypeScript.

Built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.vercel.app).

## Stack

- **Framework**: Next.js 16 (App Router)
- **Docs engine**: Fumadocs 16
- **UI**: Shadcn/ui (Radix Nova)
- **Styling**: Tailwind CSS 4
- **Content**: MDX with Fumadocs source layer

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Output is in `.next/`.

## Content

Doc pages live in `content/docs/`. Blog posts are in `app/blog/`. See `source.config.ts` for the Fumadocs configuration.

## Deployment

Auto-deploys to [ctrodb.vercel.app](https://ctrodb.vercel.app) on push to `main`.
