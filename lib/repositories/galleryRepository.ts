import type { GalleryMediaItem, Org } from "@/lib/types";

export interface CreateGalleryMediaInput {
    org: Org;
    categoryId: string;
    url: string;
    alt: string;
    storagePath: string | null;
}

export interface GalleryRepository {
    // No categoryId → all of that org's images (any category), used for the
    // public pinned-images feed and the "show more" tabbed gallery.
    list(org: Org, categoryId?: string): Promise<GalleryMediaItem[]>;
    listPinned(org: Org): Promise<GalleryMediaItem[]>;
    createMany(items: CreateGalleryMediaInput[]): Promise<GalleryMediaItem[]>;
    delete(id: string): Promise<GalleryMediaItem | null>;
    deleteAll(org: Org, categoryId: string): Promise<void>;
    setPinned(id: string, pinned: boolean): Promise<void>;
}
