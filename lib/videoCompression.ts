// Browser-only. Transcodes to a web-friendly H.264/AAC MP4 entirely on the
// device via ffmpeg.wasm — the file never leaves the browser as anything
// other than the already-optimized result, so the server never touches raw
// video bytes (or pays for transcoding CPU time / hits serverless execution
// limits on large uploads).
//
// Uses the single-threaded core (@ffmpeg/core, not core-mt) deliberately:
// the multi-threaded build needs SharedArrayBuffer, which requires
// cross-origin-isolation (COOP/COEP) response headers site-wide. Trading
// some transcode speed avoids that site-wide header change.
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Self-hosted (copied from node_modules/@ffmpeg/core/dist/umd into
// /public/ffmpeg) rather than loaded from a CDN, so this doesn't depend on
// a third party's uptime.
const CORE_BASE_URL = "/ffmpeg";

let ffmpegPromise: Promise<FFmpeg> | null = null;

function loadFFmpeg(): Promise<FFmpeg> {
    if (!ffmpegPromise) {
        ffmpegPromise = (async () => {
            const ffmpeg = new FFmpeg();
            const [coreURL, wasmURL] = await Promise.all([
                toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, "text/javascript"),
                toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
            ]);
            await ffmpeg.load({ coreURL, wasmURL });
            return ffmpeg;
        })().catch((err) => {
            // Let the next call retry instead of permanently caching a failed load.
            ffmpegPromise = null;
            throw err;
        });
    }
    return ffmpegPromise;
}

export async function compressVideoFile(file: File, onProgress?: (fraction: number) => void): Promise<File> {
    try {
        const ffmpeg = await loadFFmpeg();

        const handleProgress = ({ progress }: { progress: number }) => {
            onProgress?.(Math.min(1, Math.max(0, progress)));
        };
        ffmpeg.on("progress", handleProgress);

        const inputName = `input${/\.[a-z0-9]+$/i.exec(file.name)?.[0] || ".mp4"}`;
        const outputName = "output.mp4";

        try {
            await ffmpeg.writeFile(inputName, await fetchFile(file));
            await ffmpeg.exec([
                "-i", inputName,
                "-c:v", "libx264",
                "-crf", "26",
                "-preset", "veryfast",
                "-vf", "scale='min(1920,iw)':-2",
                "-c:a", "aac",
                "-b:a", "128k",
                "-movflags", "+faststart",
                "-pix_fmt", "yuv420p",
                outputName,
            ]);

            const data = await ffmpeg.readFile(outputName);
            // ffmpeg.wasm's Uint8Array is typed against ArrayBufferLike
            // (which includes SharedArrayBuffer); File/Blob want a concrete
            // ArrayBuffer-backed view, so copy it into a fresh one.
            const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
            const name = file.name.replace(/\.[^.]+$/, "") + ".mp4";
            return new File([bytes], name, { type: "video/mp4", lastModified: file.lastModified });
        } finally {
            ffmpeg.off("progress", handleProgress);
            await ffmpeg.deleteFile(inputName).catch(() => {});
            await ffmpeg.deleteFile(outputName).catch(() => {});
        }
    } catch (err) {
        console.error("Client-side video transcoding failed, uploading original file:", err);
        return file;
    }
}
