export type PlaygroundResult = {
  result: unknown
  logs: string[]
  error: string | null
  time: number
}

export type PlaygroundExample = {
  name: string
  description: string
  code: string
}

export type OutputTab = "result" | "console"
