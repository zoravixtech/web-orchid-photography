import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";
import { Blogs } from "./lib/infrastructure/payload/collections/Blogs.ts";
import { GalleryMedia } from "./lib/infrastructure/payload/collections/GalleryMedia.ts";
import { SiteSettings } from "./lib/infrastructure/payload/globals/SiteSettings.ts";

/**
 * Payload is used purely as a headless data layer here (Local API only —
 * no admin UI or REST/GraphQL routes are mounted). The site already has its
 * own admin panel and auth at /admin; this config just gives that panel a
 * typed SQLite-backed ORM to talk to via lib/infrastructure/payload/*.
 */
export default buildConfig({
    secret: process.env.PAYLOAD_SECRET ?? "",
    db: sqliteAdapter({
        client: {
            url: process.env.DATABASE_URL ?? "",
            authToken: process.env.DATABASE_AUTH_TOKEN,
        },
        // Explicit to short-circuit findMigrationDir()'s auto-detection (which
        // otherwise pulls in Next's env-loading code — irrelevant here since we
        // rely on dev-mode schema push, not the migration CLI).
        migrationDir: "migrations",
    }),
    collections: [Blogs, GalleryMedia],
    globals: [SiteSettings],
    typescript: {
        outputFile: "lib/infrastructure/payload/payload-types.ts",
    },
});
