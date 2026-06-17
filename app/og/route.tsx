import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") || "ctrodb"
  const description = searchParams.get("description") || ""

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
            <ellipse cx="50" cy="25" rx="40" ry="12" fill="#3b82f6" opacity="0.4" />
            <rect x="10" y="25" width="80" height="50" rx="2" fill="#3b82f6" />
            <ellipse cx="50" cy="75" rx="40" ry="12" fill="#3b82f6" />
            <ellipse cx="50" cy="25" rx="40" ry="12" fill="#3b82f6" opacity="0.6" />
          </svg>
          <span style={{ fontSize: 28, color: "#93c5fd", fontWeight: 600 }}>ctrodb</span>
        </div>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            margin: 0,
            maxWidth: "90%",
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: 28,
              color: "#94a3b8",
              marginTop: "16px",
              maxWidth: "80%",
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
