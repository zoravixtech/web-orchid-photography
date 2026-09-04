import { headers } from "next/headers";
import { getAudienceFromHostname, type Audience } from "@/lib/config/domain";

// Server-component/action counterpart to Navbar's client-side hostname
// detection — reads the incoming request's Host header instead of
// window.location, so server-rendered content (Settings, Hero, Gallery,
// Services, Albums) resolves the same org the client will hydrate into.
export async function getServerAudience(): Promise<Audience> {
    const headerList = await headers();
    return getAudienceFromHostname(headerList.get("host"));
}
