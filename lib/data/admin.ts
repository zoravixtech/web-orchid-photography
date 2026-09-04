import {
    getBlogRepository,
    getGalleryRepository,
    getHeroCarouselRepository,
    getCareerRepository,
    getCategoryRepository,
    getAlbumRepository,
} from "@/lib/infrastructure";
import type { Album, BlogPost, CareerPost, Category, GalleryMediaItem, Org } from "@/lib/types";

// Uncached, fresh reads used by the admin panel (which always renders dynamically).

// The consolidated media-library page fetches one org+category tab at a
// time; heroCarouselIds is the full cross-category set for that org so the
// "Set as Hero" badge/toggle is correct no matter which tab is open.
export async function getGalleryForAdmin(
    org: Org,
    categoryId: string
): Promise<{ images: GalleryMediaItem[]; heroCarouselIds: string[] }> {
    const repo = getGalleryRepository();
    const heroRepo = getHeroCarouselRepository();
    const [images, heroCarouselIds] = await Promise.all([
        repo ? repo.list(org, categoryId) : Promise.resolve([]),
        heroRepo ? heroRepo.listSelectedIds() : Promise.resolve([]),
    ]);
    return { images, heroCarouselIds };
}

export async function listCategoriesForAdmin(org: Org): Promise<Category[]> {
    const repo = getCategoryRepository();
    if (!repo) return [];
    return repo.list(org);
}

export async function getCategoryByIdForAdmin(id: string): Promise<Category | null> {
    const repo = getCategoryRepository();
    if (!repo) return null;
    return repo.findById(id);
}

export async function listAlbumsForAdmin(org: Org): Promise<Album[]> {
    const repo = getAlbumRepository();
    if (!repo) return [];
    return repo.list(org);
}

export async function getAlbumByIdForAdmin(id: string): Promise<Album | null> {
    const repo = getAlbumRepository();
    if (!repo) return null;
    return repo.getById(id);
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

export async function listCareersForAdmin(): Promise<CareerPost[]> {
    const repo = getCareerRepository();
    if (!repo) return [];
    return repo.list();
}

export async function getCareerByIdForAdmin(id: string): Promise<CareerPost | null> {
    const repo = getCareerRepository();
    if (!repo) return null;
    return repo.findById(id);
}
