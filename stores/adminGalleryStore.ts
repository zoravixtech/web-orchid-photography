import { create } from "zustand";
import { deleteGalleryMedia, deleteAllGalleryMedia, toggleHeroCarousel } from "@/app/admin/actions/gallery";
import type { GalleryMediaItem, GallerySection } from "@/lib/types";

interface SectionState {
    images: GalleryMediaItem[];
    heroCarouselIds: Set<string>;
    /** True once real (server-fetched) data has ever been loaded into this section. */
    hydrated: boolean;
}

interface AdminGalleryStore {
    gallery: SectionState;
    kids: SectionState;
    /** Seeds/refreshes a section from a fresh server fetch. */
    hydrate: (section: GallerySection, images: GalleryMediaItem[], heroCarouselIds: string[]) => void;
    /** Appends newly-uploaded items (already persisted server-side by /api/admin/upload). */
    addImages: (section: GallerySection, items: GalleryMediaItem[]) => void;
    /** Optimistic: removes immediately, rolls back on server error. */
    deleteImage: (section: GallerySection, id: string) => Promise<{ error?: string }>;
    /** Deletes all images in a section. */
    deleteAllImages: (section: GallerySection) => Promise<{ error?: string; deletedCount?: number }>;
    /** Optimistic: flips the hero-carousel flag immediately, rolls back on server error. */
    toggleHero: (section: GallerySection, id: string, selected: boolean) => Promise<{ error?: string }>;
}

function emptySection(): SectionState {
    return { images: [], heroCarouselIds: new Set(), hydrated: false };
}

// Guards against React's "two children with the same key" warning if a
// section is ever hydrated/appended with an overlapping id — e.g. a
// server refetch landing while an optimistic addImages() from an in-flight
// upload hasn't settled yet.
function dedupeById(images: GalleryMediaItem[]): GalleryMediaItem[] {
    const seen = new Set<string>();
    const result: GalleryMediaItem[] = [];
    for (const image of images) {
        if (seen.has(image.id)) continue;
        seen.add(image.id);
        result.push(image);
    }
    return result;
}

export const useAdminGalleryStore = create<AdminGalleryStore>((set, get) => ({
    gallery: emptySection(),
    kids: emptySection(),

    hydrate: (section, images, heroCarouselIds) => {
        set({ [section]: { images: dedupeById(images), heroCarouselIds: new Set(heroCarouselIds), hydrated: true } });
    },

    addImages: (section, items) => {
        set((state) => {
            const existingIds = new Set(state[section].images.map((image) => image.id));
            const newItems = dedupeById(items).filter((item) => !existingIds.has(item.id));
            return { [section]: { ...state[section], images: [...newItems, ...state[section].images] } };
        });
    },

    deleteImage: async (section, id) => {
        const previous = get()[section];
        set({
            [section]: {
                ...previous,
                images: previous.images.filter((image) => image.id !== id),
                heroCarouselIds: new Set([...previous.heroCarouselIds].filter((heroId) => heroId !== id)),
            },
        });

        const result = await deleteGalleryMedia(id);
        if (result.error) set({ [section]: previous });
        return result;
    },

    deleteAllImages: async (section) => {
        const previous = get()[section];
        set({
            [section]: {
                ...previous,
                images: [],
                heroCarouselIds: new Set(),
            },
        });

        const result = await deleteAllGalleryMedia(section);
        if (result.error) set({ [section]: previous });
        return result;
    },

    toggleHero: async (section, id, selected) => {
        const previous = get()[section];
        const nextHeroIds = new Set(previous.heroCarouselIds);
        if (selected) nextHeroIds.add(id);
        else nextHeroIds.delete(id);
        set({ [section]: { ...previous, heroCarouselIds: nextHeroIds } });

        const result = await toggleHeroCarousel(id, selected);
        if (result.error) set({ [section]: previous });
        return result;
    },
}));

