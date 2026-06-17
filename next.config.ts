import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const withMDX = createMDX()

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
}

export default withMDX(nextConfig)
