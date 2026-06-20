import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")
  if (!q || q.length > 200) {
    return NextResponse.json({ results: "" }, { status: 400 })
  }

  try {
    const url = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(q)}`
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ctrodb-bot/1.0)",
      },
    })

    if (!res.ok) return NextResponse.json({ results: "" })

    const html = await res.text()

    // Parse DuckDuckGo lite results
    const results: string[] = []
    const linkRegex = /<a[^>]*class="result-link"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi
    const snippetRegex = /<td[^>]*class="result-snippet"[^>]*>([\s\S]*?)<\/td>/gi

    const links: string[] = []
    let m: RegExpExecArray | null
    while ((m = linkRegex.exec(html)) !== null) {
      links.push(`${m[2].replace(/<[^>]+>/g, "").trim()}: ${m[1]}`)
    }

    const snippets: string[] = []
    while ((m = snippetRegex.exec(html)) !== null) {
      snippets.push(m[1].replace(/<[^>]+>/g, "").trim())
    }

    for (let i = 0; i < Math.min(links.length, 5); i++) {
      results.push(`${links[i] || ""}${snippets[i] ? ` — ${snippets[i]}` : ""}`)
    }

    return NextResponse.json({
      results: results.length > 0
        ? `Relevant web search results:\n${results.map((r, i) => `${i + 1}. ${r}`).join("\n")}`
        : "",
    })
  } catch {
    return NextResponse.json({ results: "" })
  }
}
