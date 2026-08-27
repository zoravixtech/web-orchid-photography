import { createUploadUrl, finalizeUpload } from "@/app/admin/actions/upload";
import { compressImageFile } from "@/lib/imageCompression";
import { compressVideoFile } from "@/lib/videoCompression";
import { isVideoKind, type UploadKind } from "@/lib/uploadKinds";
import type { GalleryMediaItem } from "@/lib/types";

export interface UploadResult {
    publicUrl: string;
    /** Present only for kind "gallery"/"kids" — the created DB row. */
    galleryItem?: GalleryMediaItem;
}

function putFile(
    url: string,
    file: File,
    contentType: string,
    onProgress?: (fraction: number) => void
): Promise<void> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) onProgress(event.loaded / event.total);
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`Upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
    });
}

/**
 * Compresses/transcodes the file entirely in the browser (see lib/imageCompression.ts
 * and lib/videoCompression.ts), then uploads the file directly to R2 via a presigned URL,
 * and persists any related metadata (gallery-media row, or a site-settings field).
 */
export async function uploadFile(
    kind: UploadKind,
    file: File,
    alt: string,
    onProgress?: (fraction: number) => void
): Promise<UploadResult> {
    const reportCompress = onProgress ? (fraction: number) => onProgress(fraction * 0.4) : undefined;
    const reportUpload = onProgress ? (fraction: number) => onProgress(0.4 + fraction * 0.6) : undefined;

    const optimized = isVideoKind(kind)
        ? await compressVideoFile(file, reportCompress)
        : await compressImageFile(file, kind === "logo" ? "logo" : "photo");

    const presign = await createUploadUrl({
        kind,
        fileName: optimized.name,
        contentType: optimized.type,
        size: optimized.size,
    });
    if ("error" in presign) throw new Error(presign.error);

    await putFile(presign.uploadUrl, optimized, optimized.type, reportUpload);

    const result = await finalizeUpload(kind, [{ key: presign.key, publicUrl: presign.publicUrl, alt }]);
    if (result.error) throw new Error(result.error);

    const item = result.items?.[0];
    const galleryItem = item && "section" in item ? item : undefined;

    return { publicUrl: presign.publicUrl, galleryItem };
}
