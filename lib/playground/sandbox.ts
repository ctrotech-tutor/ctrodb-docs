import type { PlaygroundResult } from "./types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ctrodbModule: any = null

async function getCtrodb() {
  if (ctrodbModule) return ctrodbModule
  ctrodbModule = await import("ctrodb")
  return ctrodbModule
}

export async function runInSandbox(code: string, signal?: AbortSignal): Promise<PlaygroundResult> {
  const CtroDB = await getCtrodb()

  const logs: string[] = []
  const _log = console.log
  const _error = console.error

  console.log = (...args: unknown[]) => {
    logs.push(args.map((x) => (typeof x === "object" ? JSON.stringify(x, null, 2) : String(x))).join(" "))
  }
  console.error = (...args: unknown[]) => {
    logs.push("[error] " + args.map((x) => (typeof x === "object" ? JSON.stringify(x, null, 2) : String(x))).join(" "))
  }

  const start = performance.now()

  function restore() {
    console.log = _log
    console.error = _error
  }

  return new Promise((resolve) => {
    let timedOut = false

    const timeout = setTimeout(() => {
      timedOut = true
      restore()
      resolve({ result: null, logs, error: "Execution timed out after 5 seconds", time: 5000 })
    }, 5000)

    function done(result: PlaygroundResult) {
      if (timedOut) return
      clearTimeout(timeout)
      restore()
      resolve(result)
    }

    if (signal?.aborted) {
      done({ result: null, logs: [], error: "Execution cancelled", time: Math.round(performance.now() - start) })
      return
    }

    const onAbort = () => done({ result: null, logs, error: "Execution cancelled", time: Math.round(performance.now() - start) })
    signal?.addEventListener("abort", onAbort, { once: true })

    try {
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
      const fn = new AsyncFunction("CtroDB", code)
      fn(CtroDB).then(
        (result: unknown) => done({ result, logs, error: null, time: Math.round(performance.now() - start) }),
        (err: unknown) =>
          done({
            result: null,
            logs,
            error: err instanceof Error ? err.message : String(err),
            time: Math.round(performance.now() - start),
          }),
      )
    } catch (err) {
      done({
        result: null,
        logs,
        error: err instanceof Error ? err.message : String(err),
        time: Math.round(performance.now() - start),
      })
    }
  })
}

export function destroySandbox() {
  // Nothing to clean up
}
