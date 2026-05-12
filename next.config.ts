import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nextjs-starter.ddev.site",
      },
    ],
  },
  // Alias "drupal-canvas" to a local shim so Code Components that import
  // from the Canvas editor's import-map package also work in Next.js.
  turbopack: {
    resolveAlias: {
      "drupal-canvas": "./src/lib/drupal-canvas-shim.ts",
    },
  },
};

export default nextConfig;
