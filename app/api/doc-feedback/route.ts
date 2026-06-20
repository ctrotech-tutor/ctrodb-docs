import { NextRequest, NextResponse } from "next/server"
import { appendFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, title, rating } = body

    if (!slug || !rating || !["good", "bad"].includes(rating)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const entry = {
      slug,
      title: title?.slice(0, 200) || "",
      rating,
      timestamp: new Date().toISOString(),
    }

    const dir = join(process.cwd(), ".feedback")
    await mkdir(dir, { recursive: true })
    const filePath = join(dir, "docs.jsonl")
    await appendFile(filePath, JSON.stringify(entry) + "\n")

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("doc-feedback error:", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
