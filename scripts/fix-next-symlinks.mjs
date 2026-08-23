import { readdirSync, realpathSync, rmSync, cpSync, lstatSync } from "node:fs";
import { join } from "node:path";

/**
 * Turbopack writes hashed shim packages into .next/node_modules/* as
 * symlinks to the real package in the project's node_modules (e.g. for
 * server-external packages like payload). Some hosting deploy pipelines
 * (observed on Hostinger) copy the .next build output into a versioned
 * runtime directory without preserving symlinks, which turns these into
 * dangling links and crashes every request with "Cannot find module" /
 * "EEXIST". Replacing each symlink with a real copy of its target makes
 * the build self-contained regardless of how it gets copied around.
 */
function replaceSymlinksWithCopies(dir) {
    let entries;
    try {
        entries = readdirSync(dir, { withFileTypes: true });
    } catch {
        return;
    }
    for (const entry of entries) {
        const path = join(dir, entry.name);
        if (entry.isSymbolicLink()) {
            const target = realpathSync(path);
            rmSync(path, { force: true });
            cpSync(target, path, { recursive: true, dereference: true });
        } else if (lstatSync(path).isDirectory()) {
            replaceSymlinksWithCopies(path);
        }
    }
}

replaceSymlinksWithCopies(".next/node_modules");
console.log("Replaced .next/node_modules symlinks with real copies.");
