import Link from "next/link"
import Image from "next/image"
import { BookOpen, Album, Terminal } from "lucide-react"
import { GitHubIcon } from "./icons/github-icon"

const footerLinks = [
  {
    title: "Docs",
    href: "/docs/getting-started/installation",
    icon: BookOpen,
  },
  {
    title: "Playground",
    href: "/playground",
    icon: Terminal,
  },
  {
    title: "Blog",
    href: "/blog",
    icon: Album,
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/icon.svg"
                alt="ctrodb"
                width={28}
                height={28}
                className="size-7 shrink-0"
              />
              <span className="text-base font-semibold tracking-tight">
                ctrodb
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              A reactive, schema-driven client-side database for TypeScript.
              Zero dependencies. Works in Node, browsers, and React.
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pages
              </h4>
              <ul className="flex flex-col gap-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <link.icon className="size-3.5" />
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Community
              </h4>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="https://github.com/ctrotech-tutor/ctrodb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <GitHubIcon className="size-3.5" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ctrotech-tutor/ctrodb/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="size-3.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Issues
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ctrotech-tutor/ctrodb/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="size-3.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Releases
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ctrodb. MIT License.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ctrodb &mdash; the database it documents.
          </p>
        </div>
      </div>
    </footer>
  )
}
