import { existsSync, mkdirSync, copyFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * ffmpeg.wasm (see lib/videoCompression.ts) needs its core .js/.wasm files
 * served as static assets so the browser can fetch them directly, self-hosted
 * rather than from a third-party CDN. They're copied from @ffmpeg/core here
 * (at install/dev/build time) instead of being committed — the .wasm alone
 * is ~31MB and doesn't belong in git history. Idempotent: skips the copy if
 * the destination already matches the source size.
 */
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, "node_modules/@ffmpeg/core/dist/umd");
const destDir = join(root, "public/ffmpeg");

const files = ["ffmpeg-core.js", "ffmpeg-core.wasm"];

if (!existsSync(srcDir)) {
    console.warn(`[copy-ffmpeg-core] ${srcDir} not found — skipping (is @ffmpeg/core installed?)`);
    process.exit(0);
}

mkdirSync(destDir, { recursive: true });

for (const file of files) {
    const src = join(srcDir, file);
    const dest = join(destDir, file);
    if (existsSync(dest) && statSync(dest).size === statSync(src).size) {
        continue;
    }
    copyFileSync(src, dest);
    console.log(`[copy-ffmpeg-core] copied ${file}`);
}
