import type { Org, SiteSettings, SocialLinks } from "@/lib/types";

export interface UpdateSiteSettingsInput {
    heroVideoUrl?: string | null;
    stats?: SiteSettings["stats"];
    socialLinks?: SocialLinks;
}

export interface SettingsRepository {
    get(org: Org): Promise<SiteSettings | null>;
    update(org: Org, data: UpdateSiteSettingsInput): Promise<void>;
}
