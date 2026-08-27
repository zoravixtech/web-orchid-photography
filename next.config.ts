import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https",
    hostname: "images.prismic.io",
  },
  // Cloudflare R2's public "r2.dev" dev URLs (https://pub-<hash>.r2.dev/...).
  {
    protocol: "https",
    hostname: "*.r2.dev",
  },
];

const storagePublicUrlBase = process.env.STORAGE_PUBLIC_URL_BASE;
if (storagePublicUrlBase) {
  const { protocol, hostname } = new URL(storagePublicUrlBase);
  remotePatterns.push({
    protocol: protocol.replace(":", "") as "http" | "https",
    hostname,
  });
}

// The wedding site and the kidography site are served from different
// hostnames in dev (they can't share the real *.com domains locally); allow
// both so the dev server accepts requests for either. *.localhost resolves
// to 127.0.0.1 out of the box on most systems, no /etc/hosts edit needed.
const allowedDevOrigins = [
  process.env.NEXT_PUBLIC_WEDDING_DOMAIN_DEV || "theorchidphotography.localhost",
  process.env.NEXT_PUBLIC_KIDOGRAPHY_DOMAIN_DEV || "kidography.theorchidphotography.localhost",
];

const nextConfig: NextConfig = {
  allowedDevOrigins,
  images: {
    remotePatterns,
    // Local dev stores media in MinIO on localhost (see STORAGE_PUBLIC_URL_BASE).
    // Next.js blocks image optimization fetches to private IPs unless allowed.
    dangerouslyAllowLocalIP: true,
    // Next.js will optimize images on the fly via /_next/image.
    // For large historical uploads (10MB+), the 30s timeout below gives sharp enough time.
  },
  // Payload/Drizzle pull in Node-only tooling (drizzle-kit's esbuild-register,
  // native SQLite bindings, ...) that Turbopack/webpack can't usefully bundle
  // — keep them as real Node `require()`s instead.
  serverExternalPackages: ["payload", "@payloadcms/db-sqlite", "@payloadcms/drizzle", "drizzle-kit"],
  experimental: {
    // Some uploaded originals are full camera-resolution JPEGs in the 10-20MB
    // range. next/image's built-in optimizer always uses sharp internally,
    // and its default 7s budget isn't enough to decode/resize files that large,
    // which was surfacing as a 500 from /_next/image. 30s gives it enough room.
    imgOptTimeoutInSeconds: 30,
  },
  async headers() {
    return [
      {
        // ffmpeg.wasm's core (~31MB, copied from @ffmpeg/core into
        // /public/ffmpeg) — cache it so repeat video uploads in the admin
        // panel don't re-download it every time.
        source: "/ffmpeg/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
    ];
  },
};

export default nextConfig;
