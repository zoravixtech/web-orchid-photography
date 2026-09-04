import { unstable_cache } from "next/cache";
import { getSettingsRepository, getGalleryRepository, getHeroCarouselRepository } from "@/lib/infrastructure";
import type { GalleryMediaItem, Org, SiteSettings } from "@/lib/types";

export const GALLERY_TAG = "gallery";
export const HERO_CAROUSEL_TAG = "hero-carousel";
export const SETTINGS_TAG = "settings";

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
    heroVideoUrl: null,
    stats: DEFAULT_STATS,
    socialLinks: DEFAULT_SOCIAL_LINKS,
};

export const getSiteSettings = unstable_cache(
    async (org: Org): Promise<SiteSettings> => {
        const repo = getSettingsRepository();
        if (!repo) return DEFAULT_SETTINGS;

        const settings = await repo.get(org);
        if (!settings) return DEFAULT_SETTINGS;

        return {
            heroVideoUrl: settings.heroVideoUrl ?? DEFAULT_SETTINGS.heroVideoUrl,
            stats: { ...DEFAULT_STATS, ...(settings.stats ?? {}) },
            socialLinks: { ...DEFAULT_SOCIAL_LINKS, ...(settings.socialLinks ?? {}) },
        };
    },
    ["site-settings"],
    { revalidate: 86400, tags: [SETTINGS_TAG] }
);

export const getGalleryMedia = unstable_cache(
    async (org: Org, categoryId?: string): Promise<GalleryMediaItem[]> => {
        const repo = getGalleryRepository();
        if (!repo) return [];
        return repo.list(org, categoryId);
    },
    ["gallery-media"],
    { revalidate: 86400, tags: [GALLERY_TAG] }
);

export const getPinnedMedia = unstable_cache(
    async (org: Org): Promise<GalleryMediaItem[]> => {
        const repo = getGalleryRepository();
        if (!repo) return [];
        return repo.listPinned(org);
    },
    ["pinned-media"],
    { revalidate: 86400, tags: [GALLERY_TAG] }
);

// "orchid" -> wedding hero carousel, "kidography" -> kidography hero
// carousel; selected items are filtered by the org of the gallery-media
// they point at.
export const getHeroCarouselMedia = unstable_cache(
    async (org: Org): Promise<GalleryMediaItem[]> => {
        const repo = getHeroCarouselRepository();
        if (!repo) return [];
        return repo.listSelectedMedia(org);
    },
    ["hero-carousel-media"],
    { revalidate: 86400, tags: [HERO_CAROUSEL_TAG] }
);
