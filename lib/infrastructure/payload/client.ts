import { getPayload, type Payload } from "payload";
import config from "@/payload.config.mts";
import { env } from "@/lib/config/env";

declare global {
    var __payloadClientPromise: Promise<Payload> | undefined;
}

/**
 * Lazy, HMR-safe Payload Local API client (same idea as the old getPool()
 * singleton). Returns null when the database isn't configured, so the app
 * tolerates missing config at boot the same way it always has.
 */
export function getPayloadClient(): Promise<Payload> | null {
    if (!env.DATABASE_URL || !env.PAYLOAD_SECRET) return null;

    if (!globalThis.__payloadClientPromise) {
        globalThis.__payloadClientPromise = getPayload({ config });
    }
    return globalThis.__payloadClientPromise;
}
