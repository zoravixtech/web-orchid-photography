import type { GalleryMediaItem } from "@/lib/types";

export interface HeroCarouselRepository {
    listSelectedIds(): Promise<string[]>;
    listSelectedMedia(): Promise<GalleryMediaItem[]>;
    select(mediaId: string): Promise<void>;
    deselect(mediaId: string): Promise<void>;
}
