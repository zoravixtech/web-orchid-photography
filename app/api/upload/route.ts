import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { getGalleryRepository, getMediaStorage, getSettingsRepository } from "@/lib/infrastructure";
import { verifySessionToken } from "@/lib/auth/session";
import { GALLERY_TAG } from "@/lib/data/settings";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL, formatBytes } from "@/lib/uploadLimits";
import type { MediaStorage } from "@/lib/storage/mediaStorage";
import type { GallerySection } from "@/lib/types";

export const runtime = "nodejs";

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

async function uploadFile(
    storage: MediaStorage,
    file: File,
    folder: string,
    type: "image" | "video"
): Promise<{ path: string; publicUrl: string }> {
    const ext = extensionFromName(file.name, type === "video" ? ".mp4" : ".jpg");
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const publicUrl = await storage.upload({
        key: path,
        body: Buffer.from(arrayBuffer),
        contentType: file.type || undefined,
    });

    return { path, publicUrl };
}

export async function POST(request: NextRequest) {
    const token = request.cookies.get("admin_session")?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storage = getMediaStorage();
    if (!storage) {
        return NextResponse.json({ error: "Storage is not configured." }, { status: 500 });
    }

    const formData = await request.formData();
    const kind = String(formData.get("kind") ?? "");
    if (!ALLOWED_KINDS.includes(kind as UploadKind)) {
        return NextResponse.json({ error: `Invalid kind: ${kind}` }, { status: 400 });
    }

    const files = formData.getAll("files").filter((f): f is File => f instanceof File);
    if (files.length === 0) {
        return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    const isVideo = kind === "video";
    const type = isVideo ? "video" : "image";
    const folder = isVideo ? "settings/videos" : kind === "blog" ? "blogs" : kind;

    for (const file of files) {
        const allowed = isVideo ? VIDEO_TYPES : IMAGE_TYPES;
        if (!allowed.has(file.type)) {
            return NextResponse.json(
                { error: `Unsupported file type for ${kind}: ${file.type}` },
                { status: 400 }
            );
        }
        if (file.size > MAX_UPLOAD_BYTES) {
            return NextResponse.json(
                {
                    error: `"${file.name}" is ${formatBytes(file.size)}, which is over the ${MAX_UPLOAD_LABEL} limit.`,
                },
                { status: 413 }
            );
        }
    }

    try {
        const uploaded: { url: string; storagePath: string; alt: string; id?: string }[] = [];

        for (const file of files) {
            const { path, publicUrl } = await uploadFile(storage, file, folder, type);
            uploaded.push({ url: publicUrl, storagePath: path, alt: file.name || "" });
        }

        // gallery / kids: persist to gallery_media
        if (kind === "gallery" || kind === "kids") {
            const galleryRepo = getGalleryRepository();
            if (!galleryRepo) throw new Error("Database is not configured.");

            const rows = uploaded.map((item) => ({
                section: kind as GallerySection,
                url: item.url,
                alt: item.alt,
                storagePath: item.storagePath,
            }));

            const created = await galleryRepo.createMany(rows);
            created.forEach((row, index) => {
                uploaded[index].id = row.id;
            });

            revalidateTag(GALLERY_TAG, "max");
        }

        // logo / video: persist to settings
        if (kind === "logo" || kind === "video") {
            const settingsRepo = getSettingsRepository();
            if (!settingsRepo) throw new Error("Database is not configured.");

            await settingsRepo.update(
                kind === "logo" ? { logoUrl: uploaded[0].url } : { heroVideoUrl: uploaded[0].url }
            );
            revalidateTag("settings", "max");
        }

        return NextResponse.json({ items: uploaded });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Upload failed.";
        const isSizeError = /exceeded the maximum allowed size/i.test(message);
        return NextResponse.json(
            {
                error: isSizeError
                    ? `File is over the ${MAX_UPLOAD_LABEL} limit.`
                    : message,
            },
            { status: isSizeError ? 413 : 500 }
        );
    }
}
