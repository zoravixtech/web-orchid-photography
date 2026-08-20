import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
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

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    // Local dev stores media in MinIO on localhost (see STORAGE_PUBLIC_URL_BASE).
    // Next.js blocks image optimization fetches to private IPs unless allowed.
    dangerouslyAllowLocalIP: true,
  },
  // Payload/Drizzle pull in Node-only tooling (drizzle-kit's esbuild-register,
  // native SQLite bindings, ...) that Turbopack/webpack can't usefully bundle
  // — keep them as real Node `require()`s instead.
  serverExternalPackages: ["payload", "@payloadcms/db-sqlite", "@payloadcms/drizzle", "drizzle-kit"],
};

export default nextConfig;
