"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { useSearch } from "@/lib/search-context";

const navLinks = [
  {
    href: "/docs/getting-started/installation",
    label: "Documentation",
  },
  {
    href: "/playground",
    label: "Playground",
  },
  {
    href: "/blog",
    label: "Blog",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { open } = useSearch();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-(--fd-layout-width) items-center px-4">
        {/* LEFT */}
        {/* LEFT */}
        <div className="flex min-w-0 items-center">
          {/* Brand */}
          <Link
            href="/"
            className="
      group
      inline-flex
      shrink-0
      items-center
      gap-3
      rounded-xl
      transition-opacity
      hover:opacity-90
    "
          >
            <Image
              src="/icon.svg"
              alt="ctrodb"
              width={36}
              height={36}
              priority
              className="
        h-9
        w-9
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
          tracking-[-0.04em]
          text-foreground
        "
              >
                ctrodb
              </span>

              <span
                className="
          hidden
          text-[11px]
          font-medium
          text-muted-foreground
          lg:block sr-only
        "
              >
                Developer Database
              </span>
            </div>
          </Link>

          {/* Nav */}
          <ul className="ml-8 hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);

              return (
                <li key={link.href} className="list-none">
                  <Link
                    href={link.href}
                    data-active={active}
                    className="
              relative
              inline-flex
              h-9
              items-center
              rounded-lg
              px-3.5
              text-sm
              font-medium
              text-muted-foreground
              transition-all

              hover:bg-accent/50
              hover:text-foreground

              data-[active=true]:bg-accent/50
              data-[active=true]:text-foreground
              data-[active=true]:shadow-xs
            "
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <button
            onClick={open}
            aria-label="Search"
            className="
              hidden
              lg:flex
              h-9
              min-w-[250px]
              items-center
              gap-2
              rounded-full
              border
              border-border/70
              bg-secondary/40
              px-3
              text-sm
              text-muted-foreground
              transition-all
              hover:bg-accent
              hover:text-foreground
            "
          >
            <Search className="size-4 shrink-0" />

            <span>Search documentation...</span>

            <div className="ml-auto flex gap-1">
              <kbd className="rounded-md border bg-background px-1.5 py-0.5 text-[11px]">
                Ctrl
              </kbd>

              <kbd className="rounded-md border bg-background px-1.5 py-0.5 text-[11px]">
                K
              </kbd>
            </div>
          </button>

          {/* Mobile Search */}
          <button
            onClick={open}
            aria-label="Open Search"
            className="
              lg:hidden
              inline-flex
              size-9
              items-center
              justify-center
              rounded-md
              hover:bg-accent
            "
          >
            <Search className="size-4.5" />
          </button>

          <div className="md:hidden">
            <MobileNav />
          </div>

          <div className="hidden md:inline-flex">
            <ThemeToggle />
          </div>

          {/* GitHub */}
          <Link
            href="https://github.com/ctrotech-tutor/ctrodb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="
              inline-flex
              size-9
              items-center
              justify-center
              rounded-md
              transition-colors
              hover:bg-accent
            "
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577v-2.04c-3.338.724-4.042-1.61-4.042-1.61c-.546-1.39-1.333-1.76-1.333-1.76c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22v3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627.297 12 .297Z" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
