"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

import {
  ChevronDown,
  Bot,
  Terminal,
  MessageSquare,
  ExternalLink,
} from "lucide-react"

import { GitHubIcon } from "./icons/github-icon"

type OpenDropdownProps = {
  slug: string
}

const REPO_DOCS_PATH = "ctrodb-docs/content/docs"

export function OpenDropdown({ slug }: OpenDropdownProps) {
  const pageUrl = `https://ctrodb.vercel.app/docs/${slug}`

  const githubUrl =
    `https://github.com/ctrotech-tutor/ctrodb/blob/main/` +
    `${REPO_DOCS_PATH}/${encodeURIComponent(slug)}.mdx`

  const aiPrompt =
    `Review this documentation page and summarize it:\n${pageUrl}`

  const claudeUrl =
    `https://claude.ai/new?q=${encodeURIComponent(aiPrompt)}`

  const chatgptUrl =
    `https://chatgpt.com/?q=${encodeURIComponent(aiPrompt)}`

  const cursorUrl =
    `cursor://open?url=${encodeURIComponent(pageUrl)}`

  const itemClass =
    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"

  const iconClass =
    "size-4 text-muted-foreground"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="default"
          className="gap-1.5"
        >
          Open
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60"
      >
        <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Source
        </DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={itemClass}
            aria-label="Open GitHub source"
          >
            <GitHubIcon className={iconClass} />
            GitHub
            <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          AI Assistants
        </DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <a
            href={claudeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={itemClass}
          >
            <Bot className={iconClass} />
            Claude
            <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={chatgptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={itemClass}
          >
            <MessageSquare className={iconClass} />
            ChatGPT
            <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Editors
        </DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <a
            href={cursorUrl}
            className={itemClass}
          >
            <Terminal className={iconClass} />
            Cursor
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}