import type { GalleryMediaItem, GallerySection } from "@/lib/types";

export interface CreateGalleryMediaInput {
    section: GallerySection;
    url: string;
    alt: string;
    storagePath: string | null;
}

export interface GalleryRepository {
    list(section?: GallerySection): Promise<GalleryMediaItem[]>;
    createMany(items: CreateGalleryMediaInput[]): Promise<GalleryMediaItem[]>;
    delete(id: string): Promise<GalleryMediaItem | null>;
}
