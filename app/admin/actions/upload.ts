"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getGalleryRepository, getMediaStorage, getSettingsRepository } from "@/lib/infrastructure";
import { getSession } from "@/lib/auth/session";
import { GALLERY_TAG } from "@/lib/data/settings";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL, formatBytes } from "@/lib/uploadLimits";
import type { GallerySection } from "@/lib/types";

export type UploadKind = "gallery" | "kids" | "logo" | "video" | "blog";

const ALLOWED_KINDS: UploadKind[] = ["gallery", "kids", "logo", "video", "blog"];

const IMAGE_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/avif",
    "image/gif",
    "image/svg+xml",
]);

const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

function extensionFromName(name: string, fallback: string): string {
    const match = /\.([a-zA-Z0-9]+)$/.exec(name);
    return match ? `.${match[1].toLowerCase()}` : fallback;
}

export interface UploadUrlRequest {
    kind: UploadKind;
    fileName: string;
    contentType: string;
    size: number;
}

export interface UploadUrlResult {
    key: string;
    uploadUrl: string;
    publicUrl: string;
    error?: undefined;
}

export interface UploadUrlError {
    error: string;
}

/**
 * Issues a presigned R2/S3 PUT URL so the browser can upload the file bytes
 * directly to the bucket — the file never passes through this server, which
 * is what lets video uploads exceed Vercel's ~4.5MB Route Handler body limit.
 */
export async function createUploadUrl(
    input: UploadUrlRequest
): Promise<UploadUrlResult | UploadUrlError> {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };

    if (!ALLOWED_KINDS.includes(input.kind)) {
        return { error: `Invalid kind: ${input.kind}` };
    }

    const isVideo = input.kind === "video";
    const allowedTypes = isVideo ? VIDEO_TYPES : IMAGE_TYPES;
    if (!allowedTypes.has(input.contentType)) {
        return { error: `Unsupported file type for ${input.kind}: ${input.contentType}` };
    }

    // Videos have no app-level size cap; images/logo/blog covers still do.
    if (!isVideo && input.size > MAX_UPLOAD_BYTES) {
        return {
            error: `"${input.fileName}" is ${formatBytes(input.size)}, which is over the ${MAX_UPLOAD_LABEL} limit.`,
        };
    }

    const storage = getMediaStorage();
    if (!storage) return { error: "Storage is not configured." };

    const folder = isVideo ? "settings/videos" : input.kind === "blog" ? "blogs" : input.kind;
    const ext = extensionFromName(input.fileName, isVideo ? ".mp4" : ".jpg");
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;

    const uploadUrl = await storage.getPresignedUploadUrl(key, input.contentType);
    return { key, uploadUrl, publicUrl: storage.getPublicUrl(key) };
}

export interface FinalizeUploadItem {
    key: string;
    publicUrl: string;
    alt: string;
}

export interface FinalizeUploadResult {
    items?: { id?: string; url: string }[];
    error?: string;
}

/**
 * Persists metadata for files that have already been uploaded straight to
 * storage (see createUploadUrl). Only gallery/kids/logo/video kinds need a
 * DB write here — a blog cover image is just referenced by URL in the blog
 * form and saved when the post itself is saved.
 */
export async function finalizeUpload(
    kind: UploadKind,
    items: FinalizeUploadItem[]
): Promise<FinalizeUploadResult> {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };
    if (items.length === 0) return { error: "No files provided." };

    if (kind === "gallery" || kind === "kids") {
        const galleryRepo = getGalleryRepository();
        if (!galleryRepo) return { error: "Database is not configured." };

        const rows = items.map((item) => ({
            section: kind as GallerySection,
            url: item.publicUrl,
            alt: item.alt,
            storagePath: item.key,
        }));
        const created = await galleryRepo.createMany(rows);

        updateTag(GALLERY_TAG);
        revalidatePath("/");
        revalidatePath("/kidography");

        return { items: created.map((row) => ({ id: row.id, url: row.url })) };
    }

    if (kind === "logo" || kind === "video") {
        const settingsRepo = getSettingsRepository();
        if (!settingsRepo) return { error: "Database is not configured." };

        await settingsRepo.update(
            kind === "logo" ? { logoUrl: items[0].publicUrl } : { heroVideoUrl: items[0].publicUrl }
        );
        updateTag("settings");
        revalidatePath("/");

        return { items: [{ url: items[0].publicUrl }] };
    }

    return { items: items.map((item) => ({ url: item.publicUrl })) };
}
