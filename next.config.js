const PDF_FILES = [
  "./node_modules/@sparticuz/chromium/bin/**",
  "./lib/pdf-assets/**",
  "./public/images/logo_dark.png",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["framer-motion"],
    // Confirmation PDFs: Chromium can't be bundled, and its binary, the
    // embedded font and the logo have to ship with the two form routes.
    serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
    outputFileTracingIncludes: {
      "/api/jachnun-preorder": PDF_FILES,
      "/api/catering-inquiry": PDF_FILES,
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
    imageSizes: [40, 64, 128, 256, 384, 512],
  },
  async headers() {
    const rules = [
      {
        // Photos change rarely but keep their names, so a day at the edge rather
        // than `immutable`. next/image responses have their own long TTL.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
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
    // Legacy WordPress URLs, read off its Yoast sitemaps on 2026-11-14: `/`, `/privacy/`
    // (both still exist; the trailing slash is redirected by Next), plus the three below.
    // Add any further URL Search Console reports as a 404 after launch.
    return [
      // The club moved here on 2026-11-07. Shared links may still point at the old slug.
      { source: "/club", destination: "/coffee-club", permanent: true },
      { source: "/hello-world", destination: "/", permanent: true },
      { source: "/category/:path*", destination: "/", permanent: true },
      { source: "/author/:path*", destination: "/about", permanent: true },
      { source: "/feed", destination: "/", permanent: true },
      { source: "/comments/feed", destination: "/", permanent: true },
    ];
  },
};

module.exports = nextConfig;
