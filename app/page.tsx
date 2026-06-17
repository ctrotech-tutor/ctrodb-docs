import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  Database,
  Zap,
  Blocks,
  Shield,
  Box,
  GitFork,
} from "lucide-react"

const features = [
  {
    icon: Database,
    title: "Zero dependencies",
    description: "Pure TypeScript. No runtime deps, no bloat.",
  },
  {
    icon: Zap,
    title: "Reactive by default",
    description:
      "Built-in change signals. Subscribe to creates, updates, deletes.",
  },
  {
    icon: Box,
    title: "Schema-driven",
    description:
      "Define your data shape. Validation, defaults, indexes handled automatically.",
  },
  {
    icon: Blocks,
    title: "Plugin system",
    description: "FTS search, relations, validation. Or write your own.",
  },
  {
    icon: Shield,
    title: "React bindings",
    description:
      "useQuery, useDoc, useMutation. Reactive hooks that just work.",
  },
  {
    icon: GitFork,
    title: "Two adapters",
    description: "Memory for Node/testing, IndexedDB for browsers. Same API.",
  },
]

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "ctrodb",
            applicationCategory: "Database",
            operatingSystem: "Cross-platform",
            description:
              "A reactive, schema-driven client-side database for TypeScript. Zero dependencies.",
            offers: {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
            },
          }),
        }}
      />

      <section className="flex w-full max-w-5xl flex-col items-center px-6 pt-32 pb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          <span className="text-primary">ctrodb</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-muted-foreground">
          A reactive, schema-driven client-side database for TypeScript. Zero
          dependencies. Works in Node, browsers, and React.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>190+ tests</span>
          <span className="text-muted-foreground/30">/</span>
          <span>zero deps</span>
          <span className="text-muted-foreground/30">/</span>
          <span>~25 KB gzip</span>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/docs/getting-started/installation">
              Get started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs/core-concepts/database">
              Read the docs
            </Link>
          </Button>
        </div>
      </section>

      <section className="w-full max-w-5xl px-6 pb-32">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <f.icon className="mb-3 size-6 text-primary" />
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-3xl px-6 pb-32">
        <h2 className="mb-6 text-2xl font-semibold">Quick start</h2>
        <pre className="overflow-x-auto rounded-xl border border-border bg-muted p-4 text-sm">
          <code>{`npm install ctrodb`}</code>
        </pre>
        <div className="mt-8 rounded-xl border border-border bg-muted p-4">
          <pre className="overflow-x-auto text-sm">
            <code>{`import { Database } from "ctrodb"

const db = new Database({
  schema: {
    version: 1,
    collections: {
      todos: {
        fields: {
          title: { type: "string", required: true },
          done: { type: "boolean", default: false },
        },
      },
    },
  },
})

await db.connect()
const todos = db.collection("todos")

const task = await todos.create({ title: "Build a database" })
console.log(task.title) // "Build a database"`}</code>
          </pre>
        </div>
      </section>
    </main>
  )
}
