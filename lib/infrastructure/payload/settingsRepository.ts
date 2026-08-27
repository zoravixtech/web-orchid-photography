import type { Payload } from "payload";
import type {
    SettingsRepository,
    UpdateSiteSettingsInput,
} from "@/lib/repositories/settingsRepository";
import type { SiteSettings } from "@/lib/types";
import { normalizeMediaUrl } from "@/lib/utils/mediaUrl";

interface SiteSettingsDoc {
    logoUrl: string | null;
    heroVideoUrl: string | null;
    kidsHeroVideoUrl: string | null;
    stats: SiteSettings["stats"];
    socialLinks: SiteSettings["socialLinks"];
}

export class PayloadSettingsRepository implements SettingsRepository {
    constructor(private payloadPromise: Promise<Payload>) {}

    async get(): Promise<SiteSettings | null> {
        const payload = await this.payloadPromise;
        const doc = (await payload.findGlobal({
            slug: "site-settings",
        })) as SiteSettingsDoc;

        return {
            logoUrl: doc.logoUrl ? normalizeMediaUrl(doc.logoUrl) : null,
            heroVideoUrl: doc.heroVideoUrl ? normalizeMediaUrl(doc.heroVideoUrl) : null,
            kidsHeroVideoUrl: doc.kidsHeroVideoUrl ? normalizeMediaUrl(doc.kidsHeroVideoUrl) : null,
            stats: doc.stats,
            socialLinks: doc.socialLinks,
        };
    }

    async update(data: UpdateSiteSettingsInput): Promise<void> {
        const patch: Record<string, unknown> = {};
        if (data.logoUrl !== undefined) patch.logoUrl = data.logoUrl;
        if (data.heroVideoUrl !== undefined) patch.heroVideoUrl = data.heroVideoUrl;
        if (data.kidsHeroVideoUrl !== undefined) patch.kidsHeroVideoUrl = data.kidsHeroVideoUrl;
        if (data.stats !== undefined) patch.stats = data.stats;
        if (data.socialLinks !== undefined) patch.socialLinks = data.socialLinks;

        if (Object.keys(patch).length === 0) return;

        const payload = await this.payloadPromise;
        await payload.updateGlobal({
            slug: "site-settings",
            data: patch,
        });
    }
}
