"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getGalleryRepository, getMediaStorage, getSettingsRepository } from "@/lib/infrastructure";
import { getSession } from "@/lib/auth/session";
import { GALLERY_TAG, SETTINGS_TAG } from "@/lib/data/settings";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL, formatBytes } from "@/lib/uploadLimits";
import { ALLOWED_KINDS, IMAGE_TYPES, VIDEO_TYPES, isVideoKind, type UploadKind } from "@/lib/uploadKinds";
import type { GalleryMediaItem, GallerySection } from "@/lib/types";

export type { UploadKind };

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
 * (video is client-side transcoded if applicable — see lib/videoCompression.ts)
 * directly to the bucket. The file never passes through this server: that's
 * what keeps large uploads off this app's server entirely, both for Vercel's
 * request body limits and for server CPU/memory.
 */
export async function createUploadUrl(
    input: UploadUrlRequest
): Promise<UploadUrlResult | UploadUrlError> {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };

    if (!ALLOWED_KINDS.includes(input.kind)) {
        return { error: `Invalid kind: ${input.kind}` };
    }

    const isVideo = isVideoKind(input.kind);
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
    items?: (GalleryMediaItem | { url: string })[];
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

        return { items: created };
    }

    if (kind === "logo" || kind === "video" || kind === "kidsVideo") {
        const settingsRepo = getSettingsRepository();
        if (!settingsRepo) return { error: "Database is not configured." };

        const patch =
            kind === "logo"
                ? { logoUrl: items[0].publicUrl }
                : kind === "video"
                    ? { heroVideoUrl: items[0].publicUrl }
                    : { kidsHeroVideoUrl: items[0].publicUrl };
        await settingsRepo.update(patch);
        updateTag(SETTINGS_TAG);
        revalidatePath("/");
        revalidatePath("/kidography");

        return { items: [{ url: items[0].publicUrl }] };
    }

    return { items: items.map((item) => ({ url: item.publicUrl })) };
}
