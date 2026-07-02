import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/docs/")) {
    const rest = pathname.slice(6)
    if (!rest.startsWith("v")) {
      return NextResponse.redirect(new URL(`/docs/v1/${rest}`, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/docs/:path*"],
}
