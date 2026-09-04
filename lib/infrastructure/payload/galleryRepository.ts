import type { Payload } from "payload";
import type {
    CreateGalleryMediaInput,
    GalleryRepository,
} from "@/lib/repositories/galleryRepository";
import type { GalleryMediaItem, Org } from "@/lib/types";
import { normalizeMediaUrl } from "@/lib/utils/mediaUrl";

export interface GalleryDoc {
    id: string | number;
    org: string | null;
    category: string | number | { id: string | number } | null;
    url: string;
    alt: string;
    storagePath: string | null;
    pinned: boolean | null;
    createdAt: string;
}

// Legacy rows predating the org/category rework read as null until
// scripts/migrate-org-schema.mts backfills them.
function categoryIdOf(doc: GalleryDoc): string {
    if (doc.category === null) return "";
    return typeof doc.category === "object" ? String(doc.category.id) : String(doc.category);
}

export function mapGalleryDoc(doc: GalleryDoc): GalleryMediaItem {
    return {
        id: String(doc.id),
        org: (doc.org ?? "orchid") as Org,
        categoryId: categoryIdOf(doc),
        url: normalizeMediaUrl(doc.url, doc.storagePath),
        alt: doc.alt ?? "",
        storagePath: doc.storagePath ?? null,
        pinned: Boolean(doc.pinned),
        createdAt: doc.createdAt,
    };
}

export class PayloadGalleryRepository implements GalleryRepository {
    constructor(private payloadPromise: Promise<Payload>) {}

    async list(org: Org, categoryId?: string): Promise<GalleryMediaItem[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "gallery-media",
            where: {
                and: [
                    { org: { equals: org } },
                    ...(categoryId ? [{ category: { equals: categoryId } }] : []),
                ],
            },
            sort: "-createdAt",
            limit: 0,
        });
        return (docs as GalleryDoc[]).map(mapGalleryDoc);
    }

    async listPinned(org: Org): Promise<GalleryMediaItem[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "gallery-media",
            where: { and: [{ org: { equals: org } }, { pinned: { equals: true } }] },
            sort: "-createdAt",
            limit: 0,
        });
        return (docs as GalleryDoc[]).map(mapGalleryDoc);
    }

    async createMany(items: CreateGalleryMediaInput[]): Promise<GalleryMediaItem[]> {
        const payload = await this.payloadPromise;
        const created = await Promise.all(
            items.map((item) =>
                payload.create({
                    collection: "gallery-media",
                    data: {
                        org: item.org,
                        category: Number(item.categoryId),
                        url: item.url,
                        alt: item.alt,
                        storagePath: item.storagePath,
                    },
                })
            )
        );
        return (created as GalleryDoc[]).map(mapGalleryDoc);
    }

    async delete(id: string): Promise<GalleryMediaItem | null> {
        const payload = await this.payloadPromise;
        try {
            const doc = (await payload.delete({
                collection: "gallery-media",
                id,
            })) as GalleryDoc;
            return mapGalleryDoc(doc);
        } catch {
            return null;
        }
    }

    async deleteAll(org: Org, categoryId: string): Promise<void> {
        const payload = await this.payloadPromise;
        await payload.delete({
            collection: "gallery-media",
            where: { and: [{ org: { equals: org } }, { category: { equals: categoryId } }] },
        });
    }

    async setPinned(id: string, pinned: boolean): Promise<void> {
        const payload = await this.payloadPromise;
        await payload.update({
            collection: "gallery-media",
            id,
            data: { pinned },
        });
    }
}
