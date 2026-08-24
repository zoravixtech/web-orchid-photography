import { getBlogRepository, getGalleryRepository, getHeroCarouselRepository } from "@/lib/infrastructure";
import type { BlogPost, GalleryMediaItem } from "@/lib/types";

// Uncached, fresh reads used by the admin panel (which always renders dynamically).

export async function listGalleryMedia(): Promise<GalleryMediaItem[]> {
    const repo = getGalleryRepository();
    if (!repo) return [];
    return repo.list();
}

export async function getGalleryForAdmin(): Promise<{
    gallery: GalleryMediaItem[];
    kids: GalleryMediaItem[];
    heroCarouselIds: string[];
}> {
    const heroRepo = getHeroCarouselRepository();
    const [all, heroCarouselIds] = await Promise.all([
        listGalleryMedia(),
        heroRepo ? heroRepo.listSelectedIds() : Promise.resolve([]),
    ]);
    return {
        gallery: all.filter((item) => item.section === "gallery"),
        kids: all.filter((item) => item.section === "kids"),
        heroCarouselIds,
    };
}

export async function listBlogsForAdmin(): Promise<BlogPost[]> {
    const repo = getBlogRepository();
    if (!repo) return [];
    return repo.list();
}

export async function getBlogByIdForAdmin(id: string): Promise<BlogPost | null> {
    const repo = getBlogRepository();
    if (!repo) return null;
    return repo.findById(id);
}
