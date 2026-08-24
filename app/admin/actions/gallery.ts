"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getGalleryRepository, getHeroCarouselRepository, getMediaStorage } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import { GALLERY_TAG, HERO_CAROUSEL_TAG } from "@/lib/data/settings";

export interface GalleryActionResult {
    error?: string;
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

    return {};
}
