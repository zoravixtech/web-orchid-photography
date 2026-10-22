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
    const hostAudience = getAudienceFromHostname(request.headers.get("host"));
    const isKidography = hostAudience === "kidography" || pathname.startsWith("/kidography");
    const audience = isKidography ? "kidography" : "orchid";

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-audience", audience);

    // If on kidography subdomain and accessing an org-scoped path (e.g. /, /services, /gallery, /albums/...)
    if (hostAudience === "kidography" && isOrgScopedPath(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = pathname === "/" ? "/kidography" : `/kidography${pathname}`;
        return NextResponse.rewrite(url, {
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static, _next/image
         * - api routes
         * - static files (*.webp, *.png, *.jpg, *.jpeg, *.gif, *.svg, *.ico, *.wasm, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|wasm)).*)",
    ],
};
