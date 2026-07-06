import type { NextConfig } from "next";

// Configuration for Next.js static HTML export on Cloudflare Pages
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
