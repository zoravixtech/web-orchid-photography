import type { Payload } from "payload";
import type { HeroCarouselRepository } from "@/lib/repositories/heroCarouselRepository";
import { mapGalleryDoc, type GalleryDoc } from "@/lib/infrastructure/payload/galleryRepository";
import type { GalleryMediaItem } from "@/lib/types";

interface HeroCarouselDoc {
    id: string | number;
    media: string | number | GalleryDoc;
}

export class PayloadHeroCarouselRepository implements HeroCarouselRepository {
    constructor(private payloadPromise: Promise<Payload>) {}

    async listSelectedIds(): Promise<string[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "hero-carousel",
            depth: 0,
            limit: 0,
        });
        return (docs as HeroCarouselDoc[]).map((doc) => String(doc.media));
    }

    async listSelectedMedia(): Promise<GalleryMediaItem[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "hero-carousel",
            depth: 1,
            sort: "-createdAt",
            limit: 0,
        });
        return (docs as HeroCarouselDoc[])
            .filter((doc): doc is HeroCarouselDoc & { media: GalleryDoc } => typeof doc.media === "object")
            .map((doc) => mapGalleryDoc(doc.media));
    }

    async select(mediaId: string): Promise<void> {
        const payload = await this.payloadPromise;
        try {
            await payload.create({
                collection: "hero-carousel",
                data: { media: Number(mediaId) },
            });
        } catch {
            // Already selected (unique constraint on `media`) — treat as a no-op.
        }
    }

    async deselect(mediaId: string): Promise<void> {
        const payload = await this.payloadPromise;
        await payload.delete({
            collection: "hero-carousel",
            where: { media: { equals: Number(mediaId) } },
        });
    }
}
