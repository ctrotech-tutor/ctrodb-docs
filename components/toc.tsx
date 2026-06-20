"use client";

import { useEffect, useMemo, useState } from "react";
import { TextAlignStart } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TOCItem } from "@/lib/toc";

const ITEM_HEIGHT = 28;
const X_H2 = 8.5;
const X_H3 = 16.5;
const TOP_OFFSET = 100;

function generateTrack(items: TOCItem[]) {
  if (!items.length) {
    return {
      path: "",
      lengths: [0],
      totalLength: 1,
    };
  }

  const parts: string[] = [];
  const lengths: number[] = [0];

  let total = 0;

  for (let i = 0; i < items.length; i++) {
    const x = items[i].level === 3 ? X_H3 : X_H2;

    const y = i * ITEM_HEIGHT + ITEM_HEIGHT / 2;

    if (i === 0) {
      parts.push(`M ${x} ${y}`);
      continue;
    }

    const px = items[i - 1].level === 3 ? X_H3 : X_H2;

    const py = (i - 1) * ITEM_HEIGHT + ITEM_HEIGHT / 2;

    if (px !== x) {
      const mid = (py + y) / 2;

      parts.push(`C ${px} ${mid}, ${x} ${mid}, ${x} ${y}`);

      total += Math.abs(y - py);

      total += Math.abs(x - px) * 0.5;
    } else {
      parts.push(`L ${x} ${y}`);

      total += Math.abs(y - py);
    }

    lengths.push(total);
  }

  return {
    path: parts.join(" "),
    lengths,
    totalLength: total || 1,
  };
}

function findActive(items: TOCItem[]) {
  const headings = items
    .map((item) => ({
      id: item.id,
      el: document.getElementById(item.id),
    }))
    .filter((item) => item.el);

  if (!headings.length) {
    return "";
  }

  const scrollY = window.scrollY;

  const atBottom =
    scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;

  if (atBottom) {
    return headings.at(-1)?.id ?? "";
  }

  let current = headings[0].id;

  for (const h of headings) {
    const top = h.el!.getBoundingClientRect().top + scrollY;

    if (top <= scrollY + TOP_OFFSET) {
      current = h.id;
    } else {
      break;
    }
  }

  return current;
}

function isNextH3(items: TOCItem[], i: number) {
  return i + 1 < items.length && items[i + 1].level === 3;
}

export function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState("");

  const { path, lengths, totalLength } = useMemo(
    () => generateTrack(items),
    [items],
  );

  useEffect(() => {
    if (!items.length) return;

    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const next = findActive(items);

        setActiveId((prev) => (prev === next ? prev : next));
      });
    };

    update();

    window.addEventListener("scroll", update, {
      passive: true,
    });

    window.addEventListener("resize", update);

    const resize = new ResizeObserver(update);

    resize.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);

      resize.disconnect();

      window.removeEventListener("scroll", update);

      window.removeEventListener("resize", update);
    };
  }, [items]);

  if (!items.length) {
    return null;
  }

  const activeIndex = items.findIndex((item) => item.id === activeId);

  const activeOffset =
    activeIndex >= 0 ? (lengths[activeIndex] / totalLength) * 100 : 0;

  const activeEnd =
    activeIndex >= 0 ? (lengths[activeIndex + 1] / totalLength) * 100 : 0;

  const svgHeight = items.length * ITEM_HEIGHT + 12;

  return (
    <aside
      id="nd-toc"
      className="sticky top-0 h-screen w-64 shrink-0 pt-12 pe-4 pb-2 max-xl:hidden 2xl:w-72"
    >
      <h3 className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <TextAlignStart className="size-4" />
        On this page
      </h3>

      <div className="relative overflow-auto py-3 text-sm [mask:linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)]">
        <div className="relative flex flex-col">
          {path && (
            <svg
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                width: X_H3 + 8,
                height: svgHeight,
              }}
            >
              <defs>
                <linearGradient id="toc-track" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" />

                  <stop
                    offset={`${activeEnd}%`}
                    stopColor="var(--color-primary)"
                  />

                  <stop offset={`${activeEnd}%`} stopColor="transparent" />

                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              <path
                d={path}
                stroke="url(#toc-track)"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          )}

          {path && activeIndex >= 0 && (
            <div
              className="absolute top-0 z-20 size-1 rounded-full bg-primary transition-[offset-distance] duration-300 ease-out"
              style={{
                offsetPath: `path('${path}')`,
                offsetDistance: `${activeOffset}%`,
                offsetRotate: "0deg",
              }}
            />
          )}

          {items.map((item, i) => {
            const isActive = activeId === item.id;

            const isH3 = item.level === 3;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-active={isActive}
                className={cn(
                  "prose relative py-1.5 text-sm scroll-m-4 text-muted-foreground transition-colors hover:text-foreground wrap-anywhere data-[active=true]:text-primary",
                  i === 0 && "pt-0",
                  i === items.length - 1 && "pb-0",
                )}
                style={{
                  paddingInlineStart: isH3 ? 32 : 20,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-s-0 -top-1.5 -z-10 rtl:-scale-x-100"
                  style={{
                    width: isH3 ? 25 : 17,
                    height: "calc(100% + 6px)",
                  }}
                >
                  {isH3 ? (
                    <>
                      <path
                        d="M 8.5 0 C 8.5 8 16.5 4 16.5 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="stroke-foreground/10"
                      />

                      <line
                        x1="16.5"
                        y1="12"
                        x2="16.5"
                        y2="100%"
                        strokeWidth="1"
                        className="stroke-foreground/10"
                      />
                    </>
                  ) : (
                    <>
                      {i === 0 ? (
                        <line
                          x1="8.5"
                          y1="6"
                          x2="8.5"
                          y2="100%"
                          strokeWidth="1"
                          className="stroke-foreground/10"
                        />
                      ) : i === items.length - 1 ? (
                        <path
                          d={`M 8.5 0 C 8.5 8 ${
                            isNextH3(items, i) ? "16.5" : "8.5"
                          } 4 ${isNextH3(items, i) ? "16.5" : "8.5"} 12`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          className="stroke-foreground/10"
                        />
                      ) : (
                        <line
                          x1="8.5"
                          y1="0"
                          x2="8.5"
                          y2="100%"
                          strokeWidth="1"
                          className="stroke-foreground/10"
                        />
                      )}
                    </>
                  )}
                </svg>

                {item.text}
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
