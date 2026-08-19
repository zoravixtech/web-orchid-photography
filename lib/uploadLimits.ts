export const MAX_UPLOAD_BYTES = 52428800; // 50 MB
export const MAX_UPLOAD_LABEL = "50MB";

export function formatBytes(bytes: number): string {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
