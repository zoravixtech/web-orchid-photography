import { create } from "zustand";
import {
    deleteGalleryMedia,
    deleteAllGalleryMedia,
    toggleHeroCarousel,
    togglePinned as togglePinnedAction,
} from "@/app/admin/actions/gallery";
import type { GalleryMediaItem, Org } from "@/lib/types";

interface CategoryState {
    images: GalleryMediaItem[];
    heroCarouselIds: Set<string>;
    hydrated: boolean;
}

interface AdminGalleryStore {
    byCategory: Record<string, CategoryState>;
    /** Seeds/refreshes a category tab from a fresh server fetch. */
    hydrate: (categoryId: string, images: GalleryMediaItem[], heroCarouselIds: string[]) => void;
    /** Appends newly-uploaded items (already persisted server-side). */
    addImages: (categoryId: string, items: GalleryMediaItem[]) => void;
    /** Optimistic: removes immediately, rolls back on server error. */
    deleteImage: (categoryId: string, id: string) => Promise<{ error?: string }>;
    /** Deletes all images in a category. */
    deleteAllImages: (org: Org, categoryId: string) => Promise<{ error?: string; deletedCount?: number }>;
    /** Optimistic: flips the hero-carousel flag immediately, rolls back on server error. */
    toggleHero: (categoryId: string, id: string, selected: boolean) => Promise<{ error?: string }>;
    /** Optimistic: flips the pinned flag immediately, rolls back on server error. */
    togglePinned: (categoryId: string, id: string, pinned: boolean) => Promise<{ error?: string }>;
    /** Applies the same pinned value to every id; reverts only the ones that failed. */
    bulkTogglePinned: (categoryId: string, ids: string[], pinned: boolean) => Promise<{ error?: string; failedCount?: number }>;
    /** Applies the same hero-carousel membership to every id; reverts only the ones that failed. */
    bulkToggleHero: (categoryId: string, ids: string[], selected: boolean) => Promise<{ error?: string; failedCount?: number }>;
    /** Deletes every id; any that fail are left in place. */
    bulkDelete: (categoryId: string, ids: string[]) => Promise<{ error?: string; deletedCount?: number; failedCount?: number }>;
}

function emptyCategory(): CategoryState {
    return { images: [], heroCarouselIds: new Set(), hydrated: false };
}

// Guards against React's "two children with the same key" warning if a
// category tab is ever hydrated/appended with an overlapping id — e.g. a
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

function getOrInit(state: AdminGalleryStore, categoryId: string): CategoryState {
    return state.byCategory[categoryId] ?? emptyCategory();
}

export const useAdminGalleryStore = create<AdminGalleryStore>((set, get) => ({
    byCategory: {},

    hydrate: (categoryId, images, heroCarouselIds) => {
        set((state) => ({
            byCategory: {
                ...state.byCategory,
                [categoryId]: { images: dedupeById(images), heroCarouselIds: new Set(heroCarouselIds), hydrated: true },
            },
        }));
    },

    addImages: (categoryId, items) => {
        set((state) => {
            const previous = getOrInit(state, categoryId);
            const existingIds = new Set(previous.images.map((image) => image.id));
            const newItems = dedupeById(items).filter((item) => !existingIds.has(item.id));
            return {
                byCategory: {
                    ...state.byCategory,
                    [categoryId]: { ...previous, images: [...newItems, ...previous.images] },
                },
            };
        });
    },

    deleteImage: async (categoryId, id) => {
        const previous = getOrInit(get(), categoryId);
        set((state) => ({
            byCategory: {
                ...state.byCategory,
                [categoryId]: {
                    ...previous,
                    images: previous.images.filter((image) => image.id !== id),
                    heroCarouselIds: new Set([...previous.heroCarouselIds].filter((heroId) => heroId !== id)),
                },
            },
        }));

        const result = await deleteGalleryMedia(id);
        if (result.error) set((state) => ({ byCategory: { ...state.byCategory, [categoryId]: previous } }));
        return result;
    },

    deleteAllImages: async (org, categoryId) => {
        const previous = getOrInit(get(), categoryId);
        set((state) => ({
            byCategory: {
                ...state.byCategory,
                [categoryId]: { ...previous, images: [], heroCarouselIds: new Set() },
            },
        }));

        const result = await deleteAllGalleryMedia(org, categoryId);
        if (result.error) set((state) => ({ byCategory: { ...state.byCategory, [categoryId]: previous } }));
        return result;
    },

    toggleHero: async (categoryId, id, selected) => {
        const previous = getOrInit(get(), categoryId);
        const nextHeroIds = new Set(previous.heroCarouselIds);
        if (selected) nextHeroIds.add(id);
        else nextHeroIds.delete(id);
        set((state) => ({ byCategory: { ...state.byCategory, [categoryId]: { ...previous, heroCarouselIds: nextHeroIds } } }));

        const result = await toggleHeroCarousel(id, selected);
        if (result.error) set((state) => ({ byCategory: { ...state.byCategory, [categoryId]: previous } }));
        return result;
    },

    togglePinned: async (categoryId, id, pinned) => {
        const previous = getOrInit(get(), categoryId);
        set((state) => ({
            byCategory: {
                ...state.byCategory,
                [categoryId]: {
                    ...previous,
                    images: previous.images.map((image) => (image.id === id ? { ...image, pinned } : image)),
                },
            },
        }));

        const result = await togglePinnedAction(id, pinned);
        if (result.error) set((state) => ({ byCategory: { ...state.byCategory, [categoryId]: previous } }));
        return result;
    },

    bulkTogglePinned: async (categoryId, ids, pinned) => {
        const previous = getOrInit(get(), categoryId);
        set((state) => ({
            byCategory: {
                ...state.byCategory,
                [categoryId]: {
                    ...previous,
                    images: previous.images.map((image) => (ids.includes(image.id) ? { ...image, pinned } : image)),
                },
            },
        }));

        const results = await Promise.allSettled(ids.map((id) => togglePinnedAction(id, pinned)));
        const failedIds = ids.filter((id, i) => {
            const r = results[i];
            return r.status === "rejected" || (r.status === "fulfilled" && r.value.error);
        });
        if (failedIds.length > 0) {
            set((state) => {
                const current = getOrInit(state, categoryId);
                return {
                    byCategory: {
                        ...state.byCategory,
                        [categoryId]: {
                            ...current,
                            images: current.images.map((image) => {
                                if (!failedIds.includes(image.id)) return image;
                                const original = previous.images.find((p) => p.id === image.id);
                                return original ?? image;
                            }),
                        },
                    },
                };
            });
        }
        return failedIds.length > 0 ? { error: "Some images failed to update.", failedCount: failedIds.length } : {};
    },

    bulkToggleHero: async (categoryId, ids, selected) => {
        const previous = getOrInit(get(), categoryId);
        const nextHeroIds = new Set(previous.heroCarouselIds);
        for (const id of ids) {
            if (selected) nextHeroIds.add(id);
            else nextHeroIds.delete(id);
        }
        set((state) => ({ byCategory: { ...state.byCategory, [categoryId]: { ...previous, heroCarouselIds: nextHeroIds } } }));

        const results = await Promise.allSettled(ids.map((id) => toggleHeroCarousel(id, selected)));
        const failedIds = ids.filter((id, i) => {
            const r = results[i];
            return r.status === "rejected" || (r.status === "fulfilled" && r.value.error);
        });
        if (failedIds.length > 0) {
            set((state) => {
                const current = getOrInit(state, categoryId);
                const revertedHeroIds = new Set(current.heroCarouselIds);
                for (const id of failedIds) {
                    if (previous.heroCarouselIds.has(id)) revertedHeroIds.add(id);
                    else revertedHeroIds.delete(id);
                }
                return { byCategory: { ...state.byCategory, [categoryId]: { ...current, heroCarouselIds: revertedHeroIds } } };
            });
        }
        return failedIds.length > 0 ? { error: "Some images failed to update.", failedCount: failedIds.length } : {};
    },

    bulkDelete: async (categoryId, ids) => {
        const previous = getOrInit(get(), categoryId);
        const idSet = new Set(ids);
        set((state) => ({
            byCategory: {
                ...state.byCategory,
                [categoryId]: {
                    ...previous,
                    images: previous.images.filter((image) => !idSet.has(image.id)),
                    heroCarouselIds: new Set([...previous.heroCarouselIds].filter((heroId) => !idSet.has(heroId))),
                },
            },
        }));

        const results = await Promise.allSettled(ids.map((id) => deleteGalleryMedia(id)));
        const failedIds = ids.filter((id, i) => {
            const r = results[i];
            return r.status === "rejected" || (r.status === "fulfilled" && r.value.error);
        });
        if (failedIds.length > 0) {
            // Restore just the images that failed to delete.
            set((state) => {
                const current = getOrInit(state, categoryId);
                const restored = previous.images.filter((image) => failedIds.includes(image.id));
                return {
                    byCategory: {
                        ...state.byCategory,
                        [categoryId]: { ...current, images: dedupeById([...current.images, ...restored]) },
                    },
                };
            });
        }
        return {
            deletedCount: ids.length - failedIds.length,
            ...(failedIds.length > 0 ? { error: "Some images failed to delete.", failedCount: failedIds.length } : {}),
        };
    },
}));
