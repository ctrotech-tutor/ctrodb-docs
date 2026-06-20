import { Playground } from "@/components/playground"
import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "Playground",
  description: "Try ctrodb code in your browser — instant REPL playground.",
}

export default function PlaygroundPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100dvh-3.5rem)]">
        <Playground />
      </main>
    </>
  )
}
