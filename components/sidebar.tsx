"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SidebarGroup as SidebarGroupType } from "@/lib/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSearch } from "@/lib/search-context";
import { useSidebar } from "@/lib/sidebar-context";
import {
  ChevronDown,
  Search,
  Rocket,
  Database,
  Cable,
  Puzzle,
  Atom,
  BookOpen,
  Sparkles,
  ArrowRightLeft,
  GitPullRequest,
  PanelLeft,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Rocket,
  Database,
  Cable,
  Puzzle,
  Atom,
  BookOpen,
  Sparkles,
  ArrowRightLeft,
  GitPullRequest,
};

export function SidebarGroup({
  group,
  pathname,
  onLinkClick,
}: {
  group: SidebarGroupType;
  pathname: string;
  onLinkClick?: () => void;
}) {
  const padding = "calc(2 * var(--spacing))";
  const [open, setOpen] = useState(
    group.items.some((item) => pathname === `/docs/${item.slug}`),
  );
  const isSingle = group.items.length === 1;
  const Icon = group.icon ? iconMap[group.icon] : undefined;

  if (isSingle) {
    const item = group.items[0]!;
    const isActive = pathname === `/docs/${item.slug}`;
    return (
      <Link
        href={`/docs/${item.slug}`}
        data-active={isActive ? "true" : "false"}
        onClick={onLinkClick}
        className="relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0 transition-colors hover:bg-accent/50 hover:text-accent-foreground/80 hover:transition-none data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:hover:transition-colors data-[active=true]:before:content-[''] data-[active=true]:before:bg-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:inset-s-2.5"
        style={{ paddingInlineStart: padding }}
      >
        {Icon && <Icon />}
        {group.title}
      </Link>
    );
  }

  return (
    <div data-state={open ? "open" : "closed"}>
      <button
        type="button"
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
        onClick={() => setOpen(!open)}
        className="relative flex w-full flex-row items-center gap-2 rounded-lg p-2 text-start text-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0 transition-colors hover:bg-accent/50 hover:text-accent-foreground/80"
        style={{ paddingInlineStart: padding }}
      >
        {Icon && <Icon />}
        {group.title}
        <ChevronDown
          className={cn(
            "ms-auto transition-transform",
            open ? "rotate-0" : "-rotate-90",
          )}
          data-icon="true"
        />
      </button>
      <div
        data-state={open ? "open" : "closed"}
        hidden={!open}
        className={cn(
          "overflow-hidden data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down relative before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-border before:inset-s-2.5",
        )}
      >
        <div className="flex flex-col gap-0.5 pt-0.5">
          {group.items.map((item) => {
            const isActive = pathname === `/docs/${item.slug}`;
            return (
              <Link
                key={item.slug}
                href={`/docs/${item.slug}`}
                data-active={isActive ? "true" : "false"}
                onClick={onLinkClick}
                className="relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0 transition-colors hover:bg-accent/50 hover:text-accent-foreground/80 hover:transition-none data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:hover:transition-colors data-[active=true]:before:content-[''] data-[active=true]:before:bg-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:inset-s-2.5"
                style={{ paddingInlineStart: "calc(5 * var(--spacing))" }}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ groups }: { groups: SidebarGroupType[] }) {
  const pathname = usePathname();
  const { open: openSearch } = useSearch();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      id="nd-sidebar"
      data-collapsed={collapsed ? "true" : "false"}
      data-hovered="false"
      className="flex flex-col w-full bg-card text-sm h-full duration-250"
    >
      <div className="flex flex-col gap-3 p-4 pb-2 shrink-0">
        <div className="flex items-start justify-between">
          <Link
            href="/"
            className="
      group
      me-auto
      inline-flex
      items-center
      gap-3
      rounded-lg
      transition-opacity
      hover:opacity-90
    "
          >
            <Image
              src="/icon.svg"
              alt="ctrodb"
              width={34}
              height={34}
              priority
              className="
        h-8
        w-8
        shrink-0
        transition-transform
        duration-300
        group-hover:scale-[1.04]
      "
            />

            <div className="flex flex-col leading-none">
              <span
                className="
          text-[1rem]
          font-semibold
          tracking-[-0.03em]
          text-foreground
        "
              >
                ctrodb
              </span>

              <span
                className="
          text-[11px]
          font-medium
          text-muted-foreground sr-only
        "
              >
                Developer Database
              </span>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Collapse Sidebar"
            data-collapsed={collapsed ? "true" : "false"}
            onClick={toggle}
            className="
      inline-flex
      size-8
      items-center
      justify-center
      rounded-lg
      text-muted-foreground
      transition-colors
      hover:bg-accent
      hover:text-foreground
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-ring
      [&_svg]:size-4
    "
          >
            <PanelLeft />
          </button>
        </div>
        <button
          type="button"
          data-search-full=""
          onClick={openSearch}
          className="inline-flex items-center gap-2 rounded-lg border bg-secondary/50 p-1.5 ps-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Search className="size-4" />
          Search
          <div className="ms-auto inline-flex gap-0.5">
            <kbd className="rounded-md border bg-background px-1.5 text-xs">
              Ctrl
            </kbd>
            <kbd className="rounded-md border bg-background px-1.5 text-xs">
              K
            </kbd>
          </div>
        </button>
      </div>

      <div
        className="overflow-hidden min-h-0 flex-1"
        style={{ position: "relative" }}
      >
        <style>{`
          [data-sidebar-viewport] {
            scrollbar-width: none;
            -ms-overflow-style: none;
            -webkit-overflow-scrolling: touch;
          }
          [data-sidebar-viewport]::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div
          data-sidebar-viewport=""
          className="size-full [&>*]:flex! [&>*]:flex-col! [&>*]:gap-0.5! p-4 overscroll-contain fd-mask-both"
          style={{ overflow: "hidden scroll" }}
        >
          <div style={{ minWidth: "100%" }}>
            {groups.map((group) => (
              <SidebarGroup
                key={group.title}
                group={group}
                pathname={pathname}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col p-4 pt-2 shrink-0">
        <div className="flex text-muted-foreground items-center border bg-secondary/50 p-0.5 pe-0 rounded-lg empty:hidden">
          <a
            href="https://github.com/ctrotech-tutor/ctrodb"
            rel="noreferrer noopener"
            target="_blank"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground p-1.5 [&_svg]:size-4.5"
            aria-label="github"
            data-active="false"
          >
            <svg role="img" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
