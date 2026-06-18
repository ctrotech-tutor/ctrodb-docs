import { compileMDX } from "next-mdx-remote/rsc"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import type { ReactNode } from "react"
import { extractTOC, type TOCItem } from "./toc"

export type MDXResult = {
  content: ReactNode
  toc: TOCItem[]
}

export async function compile(mdxSource: string): Promise<MDXResult> {
  const toc = extractTOC(mdxSource)

  const { content } = await compileMDX({
    source: mdxSource,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [rehypePrettyCode, {
            theme: {
              dark: "github-dark",
              light: "github-light",
            },
            keepBackground: true,
          }],
          rehypeRaw,
        ],
      },
    },
  })

  return { content, toc }
}
