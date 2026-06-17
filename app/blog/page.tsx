import Link from "next/link"

const posts = [
  {
    slug: "why-client-side-databases",
    title: "Why Client-Side Databases Matter",
    description: "The shift towards local-first applications and what it means for developers",
    date: "2026-06-15",
    author: "ctrodb team",
    tags: ["architecture", "local-first", "web"],
  },
  {
    slug: "building-reactive-todo-app",
    title: "Building a Reactive Todo App with ctrodb and React",
    description: "Step-by-step guide to building a real-time todo app using useQuery and useMutation",
    date: "2026-06-10",
    author: "ctrodb team",
    tags: ["react", "tutorial", "example"],
  },
  {
    slug: "full-text-search-in-browser",
    title: "Full-Text Search in the Browser",
    description: "How ctrodb implements client-side full-text search without external services",
    date: "2026-06-05",
    author: "ctrodb team",
    tags: ["search", "fts", "plugins"],
  },
  {
    slug: "schema-design-patterns",
    title: "Schema Design Patterns for Client-Side Apps",
    description: "Practical patterns for structuring your client-side database schema",
    date: "2026-05-28",
    author: "ctrodb team",
    tags: ["schema", "patterns", "best-practices"],
  },
  {
    slug: "building-typescript-library",
    title: "From Alpha to v1.0.0: Building a TypeScript Library",
    description: "Lessons learned from building ctrodb — a zero-dependency client-side database",
    date: "2026-05-15",
    author: "ctrodb team",
    tags: ["typescript", "library-design", "open-source"],
  },
]

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-4xl font-bold">Blog</h1>
      <p className="mb-12 text-muted-foreground">
        Thoughts on building ctrodb, client-side databases, and TypeScript.
      </p>
      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group -mx-4 rounded-xl p-4 transition-colors hover:bg-muted"
          >
            <article>
              <time className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="mt-1 text-xl font-semibold group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-2 text-muted-foreground">{post.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  )
}

export const metadata = {
  title: "Blog",
  description: "Thoughts on building ctrodb, client-side databases, and TypeScript.",
}
