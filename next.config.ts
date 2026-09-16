import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the floating dev badge would show up in the pixel-diff screenshots
  devIndicators: false,
  // Visual verification uses its own ignored dist directory so it can run while
  // a developer has the standard `next dev` server open.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
