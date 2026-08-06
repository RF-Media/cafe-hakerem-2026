/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 96, 128, 256],
  },
  async headers() {
    const rules = [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
    // Dev-mode /_next/static chunks (e.g. webpack.js) are not content-hashed —
    // the same URL is reused across rebuilds. An immutable cache-control on
    // them means the browser never re-fetches after a restart, so it keeps
    // running an old webpack runtime against a new module map. Prod chunks
    // are hashed, so this only needs to apply there.
    if (process.env.NODE_ENV === "production") {
      rules.push({
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      });
    }
    return rules;
  },
  async redirects() {
    // [TODO: enumerate legacy WordPress URLs once Search Console access is available.
    // Per CLAUDE.md §10, every old URL with inbound links should 301 to its new equivalent.]
    return [];
  },
};

module.exports = nextConfig;
