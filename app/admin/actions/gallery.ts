"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getGalleryRepository, getHeroCarouselRepository, getMediaStorage } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import { GALLERY_TAG, HERO_CAROUSEL_TAG } from "@/lib/data/settings";
import type { Org } from "@/lib/types";

export interface GalleryActionResult {
    error?: string;
    deletedCount?: number;
}

function revalidatePublicPaths() {
    revalidatePath("/");
    revalidatePath("/kidography");
    revalidatePath("/gallery");
    revalidatePath("/kidography/gallery");
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
    revalidatePublicPaths();

    return {};
}

export async function toggleHeroCarousel(id: string, selected: boolean): Promise<GalleryActionResult> {
    await requireAdmin();

    const heroRepo = getHeroCarouselRepository();
    if (!heroRepo) return { error: "Database is not configured." };

    if (selected) await heroRepo.select(id);
    else await heroRepo.deselect(id);

    updateTag(HERO_CAROUSEL_TAG);
    revalidatePublicPaths();

    return {};
}

export async function togglePinned(id: string, pinned: boolean): Promise<GalleryActionResult> {
    await requireAdmin();

    const repo = getGalleryRepository();
    if (!repo) return { error: "Database is not configured." };

    await repo.setPinned(id, pinned);
    updateTag(GALLERY_TAG);
    revalidatePublicPaths();

    return {};
}

export async function deleteAllGalleryMedia(org: Org, categoryId: string): Promise<GalleryActionResult> {
    await requireAdmin();

    const repo = getGalleryRepository();
    if (!repo) return { error: "Database is not configured." };

    const items = await repo.list(org, categoryId);
    if (items.length === 0) return { deletedCount: 0 };

    const storage = getMediaStorage();
    const heroRepo = getHeroCarouselRepository();

    await repo.deleteAll(org, categoryId);
    if (storage) {
        for (const item of items) {
            if (!item.storagePath) continue;
            try {
                await storage.delete(item.storagePath);
            } catch (e) {
                console.error(`Failed to delete storage file ${item.storagePath}:`, e);
            }
        }
    }
    if (heroRepo) {
        for (const item of items) await heroRepo.deselect(item.id);
    }

    updateTag(GALLERY_TAG);
    updateTag(HERO_CAROUSEL_TAG);
    revalidatePublicPaths();
    revalidatePath(`/admin/${org}/gallery`);

    return { deletedCount: items.length };
}
