// Shared between the /api/admin/upload route handler and the client
// (UploadModal/SettingsForm/BlogForm/AlbumForm) — kept dependency-free so
// both sides can import it without pulling in server-only code.
export type UploadKind = "media" | "video" | "blog" | "albumCover" | "albumImage";

export const ALLOWED_KINDS: UploadKind[] = ["media", "video", "blog", "albumCover", "albumImage"];

export const IMAGE_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/avif",
    "image/gif",
    "image/svg+xml",
]);

export const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export function isVideoKind(kind: UploadKind): boolean {
    return kind === "video";
}
