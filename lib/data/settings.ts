import { unstable_cache } from "next/cache";
import { getSettingsRepository, getGalleryRepository, getHeroCarouselRepository } from "@/lib/infrastructure";
import type { GalleryMediaItem, GallerySection, SiteSettings } from "@/lib/types";

export const GALLERY_TAG = "gallery";
export const HERO_CAROUSEL_TAG = "hero-carousel";

const DEFAULT_STATS: SiteSettings["stats"] = {
    weddings: 800,
    preWeddings: 500,
    babyPhotoshoots: 250,
    corporateInterior: 20,
};

const DEFAULT_SOCIAL_LINKS: SiteSettings["socialLinks"] = {
    whatsapp: null,
    facebook: null,
    instagram: null,
    youtube: null,
    linkedin: null,
};

const DEFAULT_SETTINGS: SiteSettings = {
    logoUrl: "/favicon.webp",
    heroVideoUrl: null,
    stats: DEFAULT_STATS,
    socialLinks: DEFAULT_SOCIAL_LINKS,
};

export const getSiteSettings = unstable_cache(
    async (): Promise<SiteSettings> => {
        const repo = getSettingsRepository();
        if (!repo) return DEFAULT_SETTINGS;

        const settings = await repo.get();
        if (!settings) return DEFAULT_SETTINGS;

        return {
            logoUrl: settings.logoUrl ?? DEFAULT_SETTINGS.logoUrl,
            heroVideoUrl: settings.heroVideoUrl ?? DEFAULT_SETTINGS.heroVideoUrl,
            stats: { ...DEFAULT_STATS, ...(settings.stats ?? {}) },
            socialLinks: { ...DEFAULT_SOCIAL_LINKS, ...(settings.socialLinks ?? {}) },
        };
    },
    ["site-settings"],
    { revalidate: 86400, tags: ["settings"] }
);

export const getGalleryMedia = unstable_cache(
    async (section: GallerySection): Promise<GalleryMediaItem[]> => {
        const repo = getGalleryRepository();
        if (!repo) return [];
        return repo.list(section);
    },
    ["gallery-media"],
    { revalidate: 86400, tags: [GALLERY_TAG] }
);

export const getHeroCarouselMedia = unstable_cache(
    async (): Promise<GalleryMediaItem[]> => {
        const repo = getHeroCarouselRepository();
        if (!repo) return [];
        return repo.listSelectedMedia();
    },
    ["hero-carousel-media"],
    { revalidate: 86400, tags: [HERO_CAROUSEL_TAG] }
);
