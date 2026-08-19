"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getGalleryRepository, getMediaStorage } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import { GALLERY_TAG } from "@/lib/data/settings";

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

    updateTag(GALLERY_TAG);
    revalidatePath("/");
    revalidatePath("/kidography");

    return {};
}
