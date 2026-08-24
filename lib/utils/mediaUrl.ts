import { env } from "@/lib/config/env";

/**
 * Normalizes media URLs for public serving.
 * Converts legacy S3 endpoint URLs (e.g., https://*.r2.cloudflarestorage.com/bucket/key)
 * to public R2 / CDN URLs (e.g., https://pub-*.r2.dev/key).
 */
export function normalizeMediaUrl(url: string, storagePath?: string | null): string {
    if (!url) return url;

    const publicBase = env.STORAGE_PUBLIC_URL_BASE?.replace(/\/$/, "");

    // If storagePath is provided and publicBase exists, prefer building directly from storagePath
    if (storagePath && publicBase) {
        const cleanKey = storagePath.replace(/^\//, "");
        return `${publicBase}/${cleanKey}`;
    }

    // Check if the URL is using Cloudflare R2's S3 API endpoint (r2.cloudflarestorage.com)
    if (url.includes(".r2.cloudflarestorage.com") && publicBase) {
        try {
            const parsedUrl = new URL(url);
            const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
            const bucket = env.STORAGE_BUCKET;

            // Path is usually /<bucket-name>/<key...>
            if (bucket && pathSegments[0] === bucket) {
                const key = pathSegments.slice(1).join("/");
                return `${publicBase}/${key}`;
            } else if (pathSegments.length > 1) {
                const key = pathSegments.slice(1).join("/");
                return `${publicBase}/${key}`;
            } else if (pathSegments.length === 1) {
                return `${publicBase}/${pathSegments[0]}`;
            }
        } catch {
            // Ignore parse errors, return original
        }
    }

    // If url is using r2.dev domain with bucket name accidentally included in path, strip bucket name
    if (publicBase && url.startsWith(publicBase) && env.STORAGE_BUCKET) {
        const bucketPrefix = `${publicBase}/${env.STORAGE_BUCKET}/`;
        if (url.startsWith(bucketPrefix)) {
            return url.replace(bucketPrefix, `${publicBase}/`);
        }
    }

    return url;
}
