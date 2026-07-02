"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  getVersions,
  getDefaultVersion,
  getVersionLabel,
  getVersionBadge,
} from "@/lib/versions"

function VersionBadge({
  children,
}: {
  children: React.ReactNode
}) {
  if (!children) return null

  return (
    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
      {children}
    </span>
  )
}

export function VersionSelector({
  currentVersion,
}: {
  currentVersion?: string
}) {
  const pathname = usePathname()

  const versions = getVersions()

  const activeVersion =
    currentVersion ?? getDefaultVersion()

  function getTargetPath(version: string) {
    const segments = pathname
      .split("/")
      .filter(Boolean)

    if (
      segments[0] === "docs" &&
      segments[1]
    ) {
      segments[1] = version
      return `/${segments.join("/")}`
    }

    return `/docs/${version}/getting-started/installation`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full"
        >
          <span>
            {getVersionLabel(activeVersion)}
          </span>

          <VersionBadge>
            {getVersionBadge(activeVersion)}
          </VersionBadge>

          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52"
      >
        <DropdownMenuLabel>
          Documentation Versions
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {versions.map((version) => (
          <DropdownMenuItem
            key={version.version}
            asChild
          >
            <Link
              href={getTargetPath(version.version)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{version.label}</span>

                <VersionBadge>
                  {version.badge}
                </VersionBadge>
              </div>

              {version.version ===
                activeVersion && (
                <Check className="size-4 text-primary" />
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}