# Phase 1: Interactive Playground (`/playground`)

An in-browser REPL where users write ctrodb code and see live results.

## Architecture

### Code execution: iframe sandbox
- Parent creates hidden `<iframe>` with `srcdoc` loading ctrodb from CDN (`https://unpkg.com/ctrodb@latest/dist/index.global.js` → `CtroDB` global)
- Parent posts code via `postMessage({ code, id })`
- Iframe evaluates with `new AsyncFunction()`, captures `console.log`, posts result back
- Full isolation — user code cannot access docs site DOM/state
- 5-second timeout, kills long-running code

### Editor: CodeMirror 6
- Modular, ~100KB, standard for playgrounds
- JS syntax highlighting, bracket matching, auto-indent
- `Ctrl+Enter` / `Cmd+Enter` to run
- Dark: `oneDark` theme, Light: `github-light` theme

### Output panel
- 3 tabs: **Result** (JSON formatted), **Console** (log entries), **Error** (auto-shown)
- Execution time in ms
- "Copied result" button
- Empty state: "Hit Run or press Ctrl+Enter to execute"

## Dependencies
```
npm install @codemirror/view @codemirror/state @codemirror/language \
  @codemirror/lang-javascript @codemirror/commands \
  @codemirror/theme-one-dark codemirror
```

## Files

### New files
| File | Purpose |
|------|---------|
| `lib/playground/types.ts` | `PlaygroundResult`, `PlaygroundExample` types |
| `lib/playground/examples.ts` | 7 templates: Quick Start, CRUD, Schemas, Queries, FTS, Relations, Transactions |
| `lib/playground/sandbox.ts` | `ensureSandbox()`, `runInSandbox(code)` — iframe message passing |
| `components/playground-code-editor.tsx` | CodeMirror wrapper with `value`, `onChange`, `onRun` |
| `components/playground-output.tsx` | Result/Console/Error tabs, timing display |
| `components/playground.tsx` | Orchestrator: split layout, toolbar, state management |
| `app/playground/page.tsx` | Page wrapper with Navbar + Footer + metadata |

### Files to modify
| File | Change |
|------|--------|
| `components/navbar.tsx` | Add "Playground" link after "Blog" |

## UI Layout

### Desktop (>=1024px): side-by-side 50/50
```
┌─────────────────────────────────────────────┐
│ Navbar                                       │
├──────────────────────┬───────────────────────┤
│ Examples ▼ [▶ Run]   │  Result │ Console     │
│ [Reset] [Share]      │  ┌───────────────────┤
│ ┌──────────────────┐ │  │ { "result": ... } │
│ │ CodeMirror       │ │  │ Console output    │
│ │ Editor           │ │  │ 0.3ms             │
│ └──────────────────┘ │  └───────────────────┘
├──────────────────────┴───────────────────────┤
│ Footer                                       │
└──────────────────────────────────────────────┘
```

### Mobile (<1024px): stacked
```
┌──────────────────────┐
│ Navbar               │
├──────────────────────┤
│ Examples ▼ [▶] [↺]   │
│ CodeMirror Editor    │
│ (full width, 40vh)   │
├──────────────────────┤
│ Tab: Result/Console  │
│ Output (full width)  │
├──────────────────────┤
│ Footer               │
└──────────────────────┘
```

## Edge cases
- Empty code → button disabled with tooltip
- Syntax/runtime error → displayed in Error tab with line number
- Timeout (>5s) → sandbox kills execution, shows timeout message
- iframe creation failure → retry button
- Very large output (>100KB) → truncated with notice
- URL hash `#code=BASE64` → auto-populates editor (shareable links)
- Consecutive runs → previous result cleared on new run
