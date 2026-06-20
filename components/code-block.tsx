// components/code-block.tsx
"use client"

import { useEffect, useState } from "react"
import { codeToHtml } from "shiki"

type Props = {
  code: string
  lang?: string
  title?: string
}

export function CodeBlock({ code, lang = "ts" }: Props) {
  const [html, setHtml] = useState("")

  useEffect(() => {
    async function run() {
      const out = await codeToHtml(code, {
        lang,
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        defaultColor: false,
      })

      setHtml(out)
    }

    run()
  }, [code, lang])

  return (
    <div
      className="code-block-shiki overflow-x-auto text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}