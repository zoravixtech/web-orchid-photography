import { S3Client } from "@aws-sdk/client-s3";
import { env, isStorageConfigured } from "@/lib/config/env";

let client: S3Client | null = null;

/**
 * Lazy S3 client from STORAGE_* env. Speaks the plain S3 protocol, so it
 * works unmodified against AWS S3, Cloudflare R2, MinIO, or Backblaze B2 —
 * switching providers is just changing these env vars.
 */
export function getS3Client(): S3Client | null {
    if (!isStorageConfigured()) return null;

    if (!client) {
        client = new S3Client({
            region: env.STORAGE_REGION,
            endpoint: env.STORAGE_ENDPOINT,
            forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
            credentials: {
                accessKeyId: env.STORAGE_ACCESS_KEY_ID!,
                secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY!,
            },
        });
    }
    return client;
}
