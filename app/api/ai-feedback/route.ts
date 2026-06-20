import { NextRequest, NextResponse } from "next/server"
import { appendFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { question, response, rating, sources } = body

    if (!question || !rating || !["like", "dislike"].includes(rating)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const entry = {
      question: question.slice(0, 2000),
      response: response?.slice(0, 5000) || "",
      rating,
      sources: (sources || []).slice(0, 10),
      timestamp: new Date().toISOString(),
    }

    const dir = join(process.cwd(), ".feedback")
    await mkdir(dir, { recursive: true })
    const filePath = join(dir, "ai.jsonl")
    await appendFile(filePath, JSON.stringify(entry) + "\n")

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("ai-feedback error:", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
