import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { pageTree } from "@/lib/source"
import type { ReactNode } from "react"
import { Star } from "lucide-react"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={pageTree}
      nav={{
        title: "ctrodb",
      }}
      githubUrl="https://github.com/ctrotech-tutor/ctrodb"
      links={[
        {
          text: "Blog",
          url: "/blog",
        },
        {
          icon: <Star className="size-4" />,
          text: "GitHub",
          url: "https://github.com/ctrotech-tutor/ctrodb",
        },
      ]}
    >
      {children}
    </DocsLayout>
  )
}
