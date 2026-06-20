import Link from "next/link";
import {
  ArrowRight,
  Database,
  Zap,
  Box,
  Blocks,
  Shield,
  GitFork,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CodeBlock } from "@/components/code-block";

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
];

const stats = [
  { label: "Tests", value: "190+" },
  { label: "Dependencies", value: "zero" },
  { label: "Bundle size", value: "~25 KB" },
  { label: "TypeScript", value: "100%" },
];

export default function Home() {
  return (
    <>
      <Navbar />
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
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />

        <section className="relative flex w-full flex-col items-center overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pt-24 pb-16 text-center sm:pt-32">
            <Badge
              variant="outline"
              className="mb-6 border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary"
            >
              v1.0.0 &middot; Stable
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Reactive client-side database
              <br />
              <span className="text-primary">for TypeScript</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              A schema-driven, zero-dependency database that works in Node,
              browsers, and React.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/docs/getting-started/installation">
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/docs/core-concepts/database">Read the docs</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full max-w-5xl px-6 py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Why ctrodb?</h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need for client-side data, nothing you don&apos;t.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="border-border">
                <CardHeader>
                  <f.icon className="mb-2 size-6 text-primary" />
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="w-full border-t border-border bg-muted/50 px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl">Quick start</h2>
            <p className="mb-8 text-muted-foreground">
              Install and start using ctrodb in under a minute.
            </p>

            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <div className="size-2.5 rounded-full bg-red-500" />
                <div className="size-2.5 rounded-full bg-yellow-500" />
                <div className="size-2.5 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-muted-foreground">
                  terminal
                </span>
              </div>
              <div className="overflow-x-auto p-4 text-sm">
                <CodeBlock code="npm install ctrodb" lang="bash" />
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <div className="size-2.5 rounded-full bg-red-500" />
                <div className="size-2.5 rounded-full bg-yellow-500" />
                <div className="size-2.5 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-muted-foreground">
                  app.ts
                </span>
              </div>
              <div className="overflow-x-auto p-4 text-sm">
                <CodeBlock
                  lang="ts"
                  code={`import { Database } from "ctrodb"

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

console.log(task.title) // "Build a database"
`}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
