import type { ReactNode } from "react"

export const metadata = {
  title: "Blog",
  description: "Thoughts on building ctrodb, client-side databases, and TypeScript.",
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
