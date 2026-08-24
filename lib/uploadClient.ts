import { createUploadUrl, type UploadKind } from "@/app/admin/actions/upload";

export interface DirectUploadResult {
    key: string;
    publicUrl: string;
}

function putFile(url: string, file: File, contentType: string, onProgress?: (fraction: number) => void): Promise<void> {
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
 * Uploads a file straight to R2/S3 via a presigned URL, bypassing this
 * server entirely so large files (video) don't hit Vercel's request body
 * limit. Callers still need to persist metadata via finalizeUpload
 * afterwards for kinds that get stored in the DB (gallery/kids/logo/video).
 */
export async function uploadFileDirect(
    kind: UploadKind,
    file: File,
    onProgress?: (fraction: number) => void
): Promise<DirectUploadResult> {
    const contentType = file.type;
    const result = await createUploadUrl({
        kind,
        fileName: file.name,
        contentType,
        size: file.size,
    });
    if ("error" in result) throw new Error(result.error);

    await putFile(result.uploadUrl, file, contentType, onProgress);

    return { key: result.key, publicUrl: result.publicUrl };
}
