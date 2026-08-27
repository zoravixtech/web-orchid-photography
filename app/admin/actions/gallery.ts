"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getGalleryRepository, getHeroCarouselRepository, getMediaStorage } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import { GALLERY_TAG, HERO_CAROUSEL_TAG } from "@/lib/data/settings";

export interface GalleryActionResult {
    error?: string;
    deletedCount?: number;
}

export async function deleteGalleryMedia(id: string): Promise<GalleryActionResult> {
    await requireAdmin();

    const repo = getGalleryRepository();
    if (!repo) return { error: "Database is not configured." };

    const deleted = await repo.delete(id);

    if (deleted?.storagePath) {
        const storage = getMediaStorage();
        if (storage) await storage.delete(deleted.storagePath);
    }

    const heroRepo = getHeroCarouselRepository();
    if (heroRepo) await heroRepo.deselect(id);

    updateTag(GALLERY_TAG);
    updateTag(HERO_CAROUSEL_TAG);
    revalidatePath("/");
    revalidatePath("/kidography");

    return {};
}

export async function toggleHeroCarousel(id: string, selected: boolean): Promise<GalleryActionResult> {
    await requireAdmin();

    const heroRepo = getHeroCarouselRepository();
    if (!heroRepo) return { error: "Database is not configured." };

    if (selected) await heroRepo.select(id);
    else await heroRepo.deselect(id);

    updateTag(HERO_CAROUSEL_TAG);
    revalidatePath("/");
    revalidatePath("/kidography");

    return {};
}

export async function deleteAllGalleryMedia(section: "gallery" | "kids"): Promise<GalleryActionResult> {
    await requireAdmin();

    const repo = getGalleryRepository();
    if (!repo) return { error: "Database is not configured." };

    const items = await repo.list(section);
    if (items.length === 0) return { deletedCount: 0 };

    const storage = getMediaStorage();
    const heroRepo = getHeroCarouselRepository();

    let deletedCount = 0;
    for (const item of items) {
        const deleted = await repo.delete(item.id);
        if (deleted) {
            deletedCount++;
            if (deleted.storagePath && storage) {
                try {
                    await storage.delete(deleted.storagePath);
                } catch (e) {
                    console.error(`Failed to delete storage file ${deleted.storagePath}:`, e);
                }
            }
            if (heroRepo) {
                await heroRepo.deselect(item.id);
            }
        }
    }

    updateTag(GALLERY_TAG);
    updateTag(HERO_CAROUSEL_TAG);
    revalidatePath("/");
    revalidatePath("/kidography");
    revalidatePath("/admin/gallery");
    revalidatePath("/admin/gallery/kids");

    return { deletedCount };
}

