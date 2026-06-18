import { Providers } from "@/components/providers"
import { Geist, Geist_Mono } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: {
    template: "%s | ctrodb",
    default: "ctrodb — Reactive Client-Side Database for TypeScript",
  },
  description:
    "A reactive, schema-driven client-side database for TypeScript. Zero dependencies. Works in Node, browsers, and React.",
  metadataBase: new URL("https://ctrodb.vercel.app"),
  openGraph: {
    siteName: "ctrodb",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og?title=ctrodb&description=A reactive, schema-driven client-side database",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ctrodb",
    description:
      "A reactive, schema-driven client-side database for TypeScript.",
  },
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ctrodb",
              url: "https://ctrodb.vercel.app",
              description:
                "A reactive, schema-driven client-side database for TypeScript.",
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
