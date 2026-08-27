import { getBlogRepository, getGalleryRepository, getHeroCarouselRepository } from "@/lib/infrastructure";
import type { BlogPost, GalleryMediaItem, GallerySection } from "@/lib/types";

// Uncached, fresh reads used by the admin panel (which always renders dynamically).

export async function listGalleryMedia(): Promise<GalleryMediaItem[]> {
    const repo = getGalleryRepository();
    if (!repo) return [];
    return repo.list();
}

// Wedding gallery and kids gallery are managed on separate admin pages
// (/admin/gallery and /admin/gallery/kids); each fetches just its own section.
export async function getGalleryForAdmin(section: GallerySection): Promise<{
    images: GalleryMediaItem[];
    heroCarouselIds: string[];
}> {
    const repo = getGalleryRepository();
    const heroRepo = getHeroCarouselRepository();
    const [images, heroCarouselIds] = await Promise.all([
        repo ? repo.list(section) : Promise.resolve([]),
        heroRepo ? heroRepo.listSelectedIds() : Promise.resolve([]),
    ]);
    return { images, heroCarouselIds };
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
