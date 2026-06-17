import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://ctrodb.vercel.app"

  const docsPages = [
    "",
    "/docs/getting-started/installation",
    "/docs/getting-started/quick-start",
    "/docs/getting-started/cdn-usage",
    "/docs/core-concepts/database",
    "/docs/core-concepts/schema",
    "/docs/core-concepts/collection",
    "/docs/core-concepts/model",
    "/docs/core-concepts/query-engine",
    "/docs/adapters/overview",
    "/docs/adapters/memory-adapter",
    "/docs/adapters/indexeddb-adapter",
    "/docs/plugins/overview",
    "/docs/plugins/full-text-search",
    "/docs/plugins/relations",
    "/docs/plugins/validation",
    "/docs/plugins/custom-plugins",
    "/docs/react/setup",
    "/docs/react/use-query",
    "/docs/react/use-doc",
    "/docs/react/use-mutation",
    "/docs/react/database-provider",
    "/docs/api-reference/database",
    "/docs/api-reference/collection",
    "/docs/api-reference/schema",
    "/docs/api-reference/model",
    "/docs/api-reference/query-builder",
    "/docs/api-reference/errors",
    "/docs/api-reference/types",
    "/docs/examples/cdn-todo",
    "/docs/examples/node-cli",
    "/docs/examples/react-spa",
    "/docs/migration/from-alpha",
    "/docs/contributing",
  ]

  const blogPages = [
    "/blog/why-client-side-databases",
    "/blog/building-reactive-todo-app",
    "/blog/full-text-search-in-browser",
    "/blog/schema-design-patterns",
    "/blog/building-typescript-library",
  ]

  const allPages = [...docsPages, ...blogPages]

  return allPages.map((page) => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page.startsWith("/blog") ? "monthly" : "weekly",
    priority: page === "" ? 1 : 0.8,
  }))
}
