import type { Payload } from "payload";
import type {
    SettingsRepository,
    UpdateSiteSettingsInput,
} from "@/lib/repositories/settingsRepository";
import type { Org, SiteSettings } from "@/lib/types";
import { normalizeMediaUrl } from "@/lib/utils/mediaUrl";

interface SiteSettingsDoc {
    heroVideoUrl: string | null;
    stats: SiteSettings["stats"];
    socialLinks: SiteSettings["socialLinks"];
}

function globalSlugFor(org: Org): "site-settings-orchid" | "site-settings-kidography" {
    return org === "kidography" ? "site-settings-kidography" : "site-settings-orchid";
}

export class PayloadSettingsRepository implements SettingsRepository {
    constructor(private payloadPromise: Promise<Payload>) {}

    async get(org: Org): Promise<SiteSettings | null> {
        const payload = await this.payloadPromise;
        const doc = (await payload.findGlobal({
            slug: globalSlugFor(org),
        })) as SiteSettingsDoc;

        return {
            heroVideoUrl: doc.heroVideoUrl ? normalizeMediaUrl(doc.heroVideoUrl) : null,
            stats: doc.stats,
            socialLinks: doc.socialLinks,
        };
    }

    async update(org: Org, data: UpdateSiteSettingsInput): Promise<void> {
        const patch: Record<string, unknown> = {};
        if (data.heroVideoUrl !== undefined) patch.heroVideoUrl = data.heroVideoUrl;
        if (data.stats !== undefined) patch.stats = data.stats;
        if (data.socialLinks !== undefined) patch.socialLinks = data.socialLinks;

        if (Object.keys(patch).length === 0) return;

        const payload = await this.payloadPromise;
        await payload.updateGlobal({
            slug: globalSlugFor(org),
            data: patch,
        });
    }
}
