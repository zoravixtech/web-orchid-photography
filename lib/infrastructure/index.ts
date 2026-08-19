import { getPayloadClient } from "@/lib/infrastructure/payload/client";
import { PayloadSettingsRepository } from "@/lib/infrastructure/payload/settingsRepository";
import { PayloadGalleryRepository } from "@/lib/infrastructure/payload/galleryRepository";
import { PayloadBlogRepository } from "@/lib/infrastructure/payload/blogRepository";
import { getS3Client } from "@/lib/infrastructure/s3/client";
import { S3MediaStorage } from "@/lib/infrastructure/s3/mediaStorage";
import { env } from "@/lib/config/env";
import type { SettingsRepository } from "@/lib/repositories/settingsRepository";
import type { GalleryRepository } from "@/lib/repositories/galleryRepository";
import type { BlogRepository } from "@/lib/repositories/blogRepository";
import type { MediaStorage } from "@/lib/storage/mediaStorage";

export function getSettingsRepository(): SettingsRepository | null {
    const payload = getPayloadClient();
    return payload ? new PayloadSettingsRepository(payload) : null;
}

export function getGalleryRepository(): GalleryRepository | null {
    const payload = getPayloadClient();
    return payload ? new PayloadGalleryRepository(payload) : null;
}

export function getBlogRepository(): BlogRepository | null {
    const payload = getPayloadClient();
    return payload ? new PayloadBlogRepository(payload) : null;
}

export function getMediaStorage(): MediaStorage | null {
    const client = getS3Client();
    if (!client || !env.STORAGE_BUCKET || !env.STORAGE_PUBLIC_URL_BASE) return null;
    return new S3MediaStorage(client, env.STORAGE_BUCKET, env.STORAGE_PUBLIC_URL_BASE);
}
