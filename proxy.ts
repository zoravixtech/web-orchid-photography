import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAudienceFromHostname } from "@/lib/config/domain";

// The kidography subdomain's "/" is served by the (already existing)
// /kidography route, rewritten in place so the browser URL stays on the
// subdomain root. Rewrites are transparent to the client — usePathname()
// still reports "/", which is what lets Navbar's scroll-spy/anchor logic
// work unmodified on both domains.
export function proxy(request: NextRequest) {
    if (request.nextUrl.pathname !== "/") return NextResponse.next();
    if (getAudienceFromHostname(request.headers.get("host")) !== "kidography") {
        return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = "/kidography";
    return NextResponse.rewrite(url);
}

export const config = {
    matcher: "/",
};
