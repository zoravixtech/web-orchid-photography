import type { Payload } from "payload";
import type {
    CreateGalleryMediaInput,
    GalleryRepository,
} from "@/lib/repositories/galleryRepository";
import type { GalleryMediaItem, GallerySection } from "@/lib/types";

interface GalleryDoc {
    id: string | number;
    section: string;
    url: string;
    alt: string;
    storagePath: string | null;
    createdAt: string;
}

function mapDoc(doc: GalleryDoc): GalleryMediaItem {
    return {
        id: String(doc.id),
        section: doc.section as GallerySection,
        url: doc.url,
        alt: doc.alt ?? "",
        storagePath: doc.storagePath ?? null,
        createdAt: doc.createdAt,
    };
}

export class PayloadGalleryRepository implements GalleryRepository {
    constructor(private payloadPromise: Promise<Payload>) {}

    async list(section?: GallerySection): Promise<GalleryMediaItem[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "gallery-media",
            where: section ? { section: { equals: section } } : undefined,
            sort: "-createdAt",
            limit: 0,
        });
        return (docs as GalleryDoc[]).map(mapDoc);
    }

    async createMany(items: CreateGalleryMediaInput[]): Promise<GalleryMediaItem[]> {
        const payload = await this.payloadPromise;
        const created = await Promise.all(
            items.map((item) =>
                payload.create({
                    collection: "gallery-media",
                    data: item,
                })
            )
        );
        return (created as GalleryDoc[]).map(mapDoc);
    }

    async delete(id: string): Promise<GalleryMediaItem | null> {
        const payload = await this.payloadPromise;
        try {
            const doc = (await payload.delete({
                collection: "gallery-media",
                id,
            })) as GalleryDoc;
            return mapDoc(doc);
        } catch {
            return null;
        }
    }
}
