"use client"

import { useRef, useEffect } from "react"
import { EditorView, keymap, placeholder as placeholderExt } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { javascript } from "@codemirror/lang-javascript"
import { oneDark } from "@codemirror/theme-one-dark"
import { defaultKeymap, indentWithTab } from "@codemirror/commands"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const lightTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#ffffff",
      color: "#24292f",
    },
    ".cm-gutters": {
      backgroundColor: "#f6f8fa",
      borderRight: "1px solid #d0d7de",
      color: "#8c959f",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#e8eaed",
    },
    ".cm-activeLine": {
      backgroundColor: "#f0f2f4",
    },
    ".cm-cursor": {
      borderLeftColor: "#24292f",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "#c8d8e4",
    },
    ".cm-matchingBracket": {
      backgroundColor: "#d0d7de",
      outline: "1px solid #8c959f",
    },
    ".cm-placeholder": {
      color: "#8c959f",
    },
  },
  { dark: false },
)

export function PlaygroundCodeEditor({
  value,
  onChange,
  onRun,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onRun: () => void
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const { resolvedTheme } = useTheme()
  const isExternalUpdate = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && !isExternalUpdate.current) {
        onChange(update.state.doc.toString())
      }
      isExternalUpdate.current = false
    })

    const runKeymap = keymap.of([
      {
        key: "Mod-Enter",
        run: () => {
          onRun()
          return true
        },
      },
    ])

    const isDark = resolvedTheme === "dark"

    const state = EditorState.create({
      doc: value,
      extensions: [
        javascript({ typescript: true }),
        isDark ? oneDark : lightTheme,
        keymap.of([...defaultKeymap, indentWithTab]),
        updateListener,
        runKeymap,
        placeholderExt("// Write ctrodb code here…"),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ "aria-label": "Code editor" }),
        EditorState.readOnly.of(false),
      ],
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })
    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current !== value) {
      isExternalUpdate.current = true
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      })
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      className={cn(
        "rounded-xl border [&_.cm-editor]:outline-none [&_.cm-scroller]:overflow-auto",
        "[&_.cm-scroller]:font-mono [&_.cm-scroller]:text-sm",
        className,
      )}
    />
  )
}
