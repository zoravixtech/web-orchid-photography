import type { GalleryMediaItem, GallerySection } from "@/lib/types";

export interface HeroCarouselRepository {
    listSelectedIds(): Promise<string[]>;
    // Filtered by the section of the underlying gallery-media item, so the
    // wedding home page and the kidography home page get distinct carousels
    // without a separate audience field on this collection.
    listSelectedMedia(section: GallerySection): Promise<GalleryMediaItem[]>;
    select(mediaId: string): Promise<void>;
    deselect(mediaId: string): Promise<void>;
}
