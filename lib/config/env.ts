import { z } from "zod";

// All fields are optional here on purpose: the app tolerates missing
// database/storage config at boot (public pages fall back to defaults,
// admin mutations return a friendly "not configured" error) rather than
// crashing.
const envSchema = z.object({
    // libSQL/SQLite connection (local sqld, or a managed libSQL/Turso host).
    DATABASE_URL: z.string().min(1).optional(),
    DATABASE_AUTH_TOKEN: z.string().min(1).optional(),
    // Required by Payload's core (token signing etc.), independent of any
    // auth-enabled collection — we don't mount Payload's own admin/auth.
    PAYLOAD_SECRET: z.string().min(1).optional(),

    STORAGE_BUCKET: z.string().min(1).optional(),
    STORAGE_REGION: z.string().min(1).default("auto"),
    STORAGE_ENDPOINT: z.string().min(1).optional(),
    STORAGE_ACCESS_KEY_ID: z.string().min(1).optional(),
    STORAGE_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    STORAGE_PUBLIC_URL_BASE: z.string().min(1).optional(),
    STORAGE_FORCE_PATH_STYLE: z
        .string()
        .optional()
        .transform((value) => value === "true"),
});

export const env = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN || undefined,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    STORAGE_REGION: process.env.STORAGE_REGION,
    STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT,
    STORAGE_ACCESS_KEY_ID: process.env.STORAGE_ACCESS_KEY_ID,
    STORAGE_SECRET_ACCESS_KEY: process.env.STORAGE_SECRET_ACCESS_KEY,
    STORAGE_PUBLIC_URL_BASE: process.env.STORAGE_PUBLIC_URL_BASE,
    STORAGE_FORCE_PATH_STYLE: process.env.STORAGE_FORCE_PATH_STYLE,
});

export function isStorageConfigured(): boolean {
    return Boolean(
        env.STORAGE_BUCKET &&
        env.STORAGE_ACCESS_KEY_ID &&
        env.STORAGE_SECRET_ACCESS_KEY &&
        env.STORAGE_PUBLIC_URL_BASE
    );
}
