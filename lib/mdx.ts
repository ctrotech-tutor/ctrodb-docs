import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@shikijs/rehype";
import remarkGfm from "remark-gfm";

import type { ReactNode } from "react";

import { extractTOC, type TOCItem } from "./toc";
import { InstallTabs } from "@/components/install-tabs";

export type MDXResult = {
  content: ReactNode;
  toc: TOCItem[];
};

// ⚙️ Main MDX compiler
export async function compile(mdxSource: string): Promise<MDXResult> {
  const toc = extractTOC(mdxSource);

  const { content } = await compileMDX({
    source: mdxSource,

    components: {
      InstallTabs,
    },

    options: {
      parseFrontmatter: false,

      mdxOptions: {
        remarkPlugins: [remarkGfm],

        rehypePlugins: [
          rehypeSlug,

          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
            },
          ],

          [
            rehypeShiki,
            {
              themes: {
                light: "github-light",
                dark: "github-dark",
              },

              defaultLanguage: "plaintext",
              keepBackground: false,
              defaultColor: "light",

              // enables:
              // `const a = 1{:ts}`
              inline: "tailing-curly-colon",
            },
          ],
        ],
      },
    },
  });

  return {
    content,
    toc,
  };
}
