"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Check, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { getVersions, getDefaultVersion, getVersionLabel } from "@/lib/versions"

export function VersionSelectorNav({ currentVersion }: { currentVersion?: string }) {
  const pathname = usePathname()
  const versions = getVersions()
  const ver = currentVersion || getDefaultVersion()
  const label = getVersionLabel(ver)

  function getTargetPath(v: string) {
    const parts = pathname.split("/").filter(Boolean)
    if (parts[0] === "docs" && parts.length >= 2 && parts[1].startsWith("v")) {
      parts[1] = v
      return "/" + parts.join("/")
    }
    return `/docs/${v}/getting-started/installation`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          {label}
          <ChevronDown className="size-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {versions.map((v) => (
          <DropdownMenuItem key={v.version} asChild>
            <Link
              href={getTargetPath(v.version)}
              className="flex items-center justify-between"
            >
              <span>{v.label}</span>
              {v.version === ver && <Check className="size-4" />}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
