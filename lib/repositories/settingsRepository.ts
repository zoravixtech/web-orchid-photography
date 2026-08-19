import type { SiteSettings, SocialLinks } from "@/lib/types";

export interface UpdateSiteSettingsInput {
    logoUrl?: string | null;
    heroVideoUrl?: string | null;
    stats?: SiteSettings["stats"];
    socialLinks?: SocialLinks;
}

export interface SettingsRepository {
    get(): Promise<SiteSettings | null>;
    update(data: UpdateSiteSettingsInput): Promise<void>;
}
