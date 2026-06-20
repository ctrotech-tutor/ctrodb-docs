"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import * as Collapsible from "@radix-ui/react-collapsible"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import type { TOCItem } from "@/lib/toc"

type TocPopoverProps = {
  items: TOCItem[]
  activeId?: string
}

const TOP_OFFSET = 100

function findActive(
  items: TOCItem[],
) {
  const scrollY =
    window.scrollY

  const atBottom =
    scrollY +
      window.innerHeight >=
    document.documentElement
      .scrollHeight -
      8

  let current = ""

  for (const item of items) {
    const el =
      document.getElementById(
        item.id,
      )

    if (!el) continue

    if (atBottom) {
      current =
        item.id

      continue
    }

    const top =
      el
        .getBoundingClientRect()
        .top +
      scrollY

    if (
      top <=
      scrollY +
        TOP_OFFSET
    ) {
      current =
        item.id
    } else {
      break
    }
  }

  return current
}

function getProgress() {
  const max =
    document.documentElement
      .scrollHeight -
    window.innerHeight

  return max > 0
    ? window.scrollY /
        max
    : 0
}

export function TocPopover({
  items,
  activeId: externalActive =
    "",
}: TocPopoverProps) {
  const [
    open,
    setOpen,
  ] =
    useState(
      false,
    )

  const [
    progress,
    setProgress,
  ] =
    useState(
      0,
    )

  const [
    internalActive,
    setInternalActive,
  ] =
    useState(
      "",
    )

  const containerRef =
    useRef<HTMLDivElement>(
      null,
    )

  const rafRef =
    useRef<number>(
      null,
    )

  const activeId =
    internalActive ||
    externalActive

  useEffect(() => {
    if (
      !items.length
    )
      return

    const run =
      () => {
        setProgress(
          getProgress(),
        )

        setInternalActive(
          (
            prev,
          ) => {
            const next =
              findActive(
                items,
              )

            return prev ===
              next
              ? prev
              : next
          },
        )

        setOpen(
          (
            prev,
          ) =>
            prev
              ? false
              : prev,
        )

        rafRef.current =
          null
      }

    const schedule =
      () => {
        if (
          rafRef.current !==
          null
        ) {
          return
        }

        rafRef.current =
          requestAnimationFrame(
            run,
          )
      }

    schedule()

    window.addEventListener(
      "scroll",
      schedule,
      {
        passive:
          true,
      },
    )

    window.addEventListener(
      "resize",
      schedule,
    )

    return () => {
      if (
        rafRef.current !==
        null
      ) {
        cancelAnimationFrame(
          rafRef.current,
        )
      }

      window.removeEventListener(
        "scroll",
        schedule,
      )

      window.removeEventListener(
        "resize",
        schedule,
      )
    }
  }, [items])

  useEffect(() => {
    if (!open)
      return

    const outside =
      (
        e: PointerEvent,
      ) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(
            e.target as Node,
          )
        ) {
          setOpen(
            false,
          )
        }
      }

    const escape =
      (
        e: KeyboardEvent,
      ) => {
        if (
          e.key ===
          "Escape"
        ) {
          setOpen(
            false,
          )
        }
      }

    document.addEventListener(
      "pointerdown",
      outside,
    )

    document.addEventListener(
      "keydown",
      escape,
    )

    return () => {
      document.removeEventListener(
        "pointerdown",
        outside,
      )

      document.removeEventListener(
        "keydown",
        escape,
      )
    }
  }, [open])

  const activeIndex =
    useMemo(
      () =>
        items.findIndex(
          (
            i,
          ) =>
            i.id ===
            activeId,
        ),
      [
        items,
        activeId,
      ],
    )

  const displayText =
    activeIndex >=
    0
      ? items[
          activeIndex
        ]?.text
      : "On this page"

  const circumference =
    2 *
    Math.PI *
    7.5

  const offset =
    circumference *
    (1 -
      progress)

  return (
    <div
      ref={
        containerRef
      }
      className="sticky top-14 z-10 h-10 [grid-area:toc-popover] xl:hidden"
    >
      <header className="border-b bg-background/80 backdrop-blur-xl">

        <button
          type="button"
          aria-expanded={
            open
          }
          onClick={() =>
            setOpen(
              (
                v,
              ) =>
                !v,
            )
          }
          className="group flex h-10 w-full items-center gap-2.5 px-4 text-start text-sm text-muted-foreground hover:bg-accent/20 md:px-6"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <circle
              cx="9"
              cy="9"
              r="7.5"
              fill="none"
              strokeWidth="1.5"
              className="stroke-current/20"
            />

            <circle
              cx="9"
              cy="9"
              r="7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={
                circumference
              }
              strokeDashoffset={
                offset
              }
              transform="rotate(-90 9 9)"
              className="transition-all duration-300"
            />
          </svg>

          <span className="truncate flex-1">
            {displayText}
          </span>

          <ChevronDown
            className={cn(
              "transition-transform duration-300",
              open &&
                "rotate-180",
            )}
          />
        </button>

        <Collapsible.Root
          open={open}
          onOpenChange={
            setOpen
          }
        >
          <Collapsible.Content className="overflow-hidden data-[state=open]:animate-fd-collapsible-down data-[state=closed]:animate-fd-collapsible-up">

            <div className="max-h-[50vh] overflow-auto p-4 pt-0">

              {items.map(
                (
                  item,
                ) => (
                  <a
                    key={
                      item.id
                    }
                    href={`#${item.id}`}
                    onClick={() =>
                      setOpen(
                        false,
                      )
                    }
                    data-active={
                      item.id ===
                      activeId
                    }
                    className="block rounded-lg p-2 text-muted-foreground transition hover:bg-accent/50 hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    style={{
                      paddingInlineStart:
                        item.level >
                        2
                          ? 24
                          : 16,
                    }}
                  >
                    {item.text}
                  </a>
                ),
              )}

            </div>

          </Collapsible.Content>

        </Collapsible.Root>
      </header>
    </div>
  )
}