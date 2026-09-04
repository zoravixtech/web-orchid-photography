import type { GalleryMediaItem, Org } from "@/lib/types";

export interface HeroCarouselRepository {
    listSelectedIds(): Promise<string[]>;
    // Filtered by the org of the underlying gallery-media item, so the
    // orchid home page and the kidography home page get distinct carousels
    // without a separate audience field on this collection.
    listSelectedMedia(org: Org): Promise<GalleryMediaItem[]>;
    select(mediaId: string): Promise<void>;
    deselect(mediaId: string): Promise<void>;
}
