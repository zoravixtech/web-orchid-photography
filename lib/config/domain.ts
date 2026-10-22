// Audience (wedding vs kidography) is resolved purely from the request
// hostname so it works identically on the server (proxy.ts, via the `host`
// header) and in the browser (Navbar, via window.location.hostname) without
// any shared request-scoped state.
//
// Domains are read straight from NEXT_PUBLIC_* env vars (same convention as
// NEXT_PUBLIC_SITE_URL elsewhere in this app) so they're inlined into the
// client bundle at build time. The *_DEV pair is used in development because
// the real *.com domains can't be pointed at localhost.
export type Audience = "orchid" | "kidography";

function isDev(): boolean {
    return process.env.NODE_ENV === "development";
}

export function getWeddingDomain(): string {
    return isDev()
        ? process.env.NEXT_PUBLIC_WEDDING_DOMAIN_DEV || "orchid.localhost"
        : process.env.NEXT_PUBLIC_WEDDING_DOMAIN || "theorchidphotography.com";
}

export function getKidographyDomain(): string {
    return isDev()
        ? process.env.NEXT_PUBLIC_KIDOGRAPHY_DOMAIN_DEV || "kidography.localhost"
        : process.env.NEXT_PUBLIC_KIDOGRAPHY_DOMAIN || "kidography.theorchidphotography.com";
}

export function getAudienceFromHostname(hostname: string | null | undefined): Audience {
    const host = (hostname ?? "").toLowerCase().split(":")[0];
    const kidographyDev = (process.env.NEXT_PUBLIC_KIDOGRAPHY_DOMAIN_DEV || "kidography.localhost").toLowerCase().split(":")[0];
    const kidographyProd = (process.env.NEXT_PUBLIC_KIDOGRAPHY_DOMAIN || "kidography.theorchidphotography.com").toLowerCase().split(":")[0];

    if (
        host === kidographyDev ||
        host === kidographyProd ||
        host === "kidography.localhost" ||
        host === "kidography.theorchidphotography.localhost" ||
        host.startsWith("kidography.")
    ) {
        return "kidography";
    }
    return "orchid";
}
