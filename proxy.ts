import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAudienceFromHostname } from "@/lib/config/domain";

// Org-scoped public routes: on the kidography subdomain each of these is
// served by its "/kidography/..." twin, rewritten in place so the browser
// URL stays clean. Rewrites are transparent to the client — usePathname()
// still reports the original path, which is what lets Navbar's scroll-spy/
// anchor logic work unmodified on both domains. Shared routes (/about,
// /blog, /career, /admin) are intentionally not in this list.
const ORG_SCOPED_PATHS = ["/", "/services", "/albums", "/gallery"];

function isOrgScopedPath(pathname: string): boolean {
    return (
        ORG_SCOPED_PATHS.includes(pathname) ||
        (pathname.startsWith("/albums/") && pathname !== "/albums/")
    );
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (!isOrgScopedPath(pathname)) return NextResponse.next();
    if (getAudienceFromHostname(request.headers.get("host")) !== "kidography") {
        return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/kidography" : `/kidography${pathname}`;
    return NextResponse.rewrite(url);
}

export const config = {
    matcher: ["/", "/services", "/albums", "/albums/:slug*", "/gallery"],
};
