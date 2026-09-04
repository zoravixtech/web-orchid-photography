import type { Payload } from "payload";
import type {
    AddAlbumImageInput,
    AlbumRepository,
    CreateAlbumInput,
    UpdateAlbumInput,
} from "@/lib/repositories/albumRepository";
import type { Album, Org } from "@/lib/types";
import { normalizeMediaUrl } from "@/lib/utils/mediaUrl";

interface AlbumImageDoc {
    id: string;
    url: string;
    storagePath: string | null;
    alt: string | null;
}

interface AlbumDoc {
    id: string | number;
    org: string;
    name: string;
    slug: string;
    coverImage: string;
    images: AlbumImageDoc[] | null;
    createdAt: string;
}

function mapDoc(doc: AlbumDoc): Album {
    return {
        id: String(doc.id),
        org: doc.org as Org,
        name: doc.name,
        slug: doc.slug,
        coverImage: normalizeMediaUrl(doc.coverImage),
        images: (doc.images ?? []).map((image) => ({
            id: image.id,
            url: normalizeMediaUrl(image.url, image.storagePath),
            storagePath: image.storagePath ?? null,
            alt: image.alt ?? "",
        })),
        createdAt: doc.createdAt,
    };
}

export class PayloadAlbumRepository implements AlbumRepository {
    constructor(private payloadPromise: Promise<Payload>) {}

    async list(org: Org): Promise<Album[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "albums",
            where: { org: { equals: org } },
            sort: "-createdAt",
            limit: 0,
        });
        return (docs as AlbumDoc[]).map(mapDoc);
    }

    async getById(id: string): Promise<Album | null> {
        const payload = await this.payloadPromise;
        try {
            const doc = (await payload.findByID({ collection: "albums", id })) as AlbumDoc;
            return mapDoc(doc);
        } catch {
            return null;
        }
    }

    async getBySlug(org: Org, slug: string): Promise<Album | null> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "albums",
            where: { and: [{ org: { equals: org } }, { slug: { equals: slug } }] },
            limit: 1,
        });
        return docs.length > 0 ? mapDoc(docs[0] as AlbumDoc) : null;
    }

    async create(input: CreateAlbumInput): Promise<Album> {
        const payload = await this.payloadPromise;
        const doc = (await payload.create({
            collection: "albums",
            data: { org: input.org, name: input.name, coverImage: input.coverImage, images: [] },
        })) as AlbumDoc;
        return mapDoc(doc);
    }

    async update(id: string, input: UpdateAlbumInput): Promise<Album> {
        const payload = await this.payloadPromise;
        const doc = (await payload.update({
            collection: "albums",
            id,
            data: {
                ...(input.name !== undefined ? { name: input.name } : {}),
                ...(input.coverImage !== undefined ? { coverImage: input.coverImage } : {}),
            },
        })) as AlbumDoc;
        return mapDoc(doc);
    }

    async delete(id: string): Promise<void> {
        const payload = await this.payloadPromise;
        await payload.delete({ collection: "albums", id });
    }

    async addImages(id: string, images: AddAlbumImageInput[]): Promise<Album> {
        const payload = await this.payloadPromise;
        const existing = (await payload.findByID({ collection: "albums", id })) as AlbumDoc;
        const nextImages = [...(existing.images ?? []), ...images];
        const doc = (await payload.update({
            collection: "albums",
            id,
            data: { images: nextImages },
        })) as AlbumDoc;
        return mapDoc(doc);
    }

    async removeImage(id: string, imageId: string): Promise<Album> {
        const payload = await this.payloadPromise;
        const existing = (await payload.findByID({ collection: "albums", id })) as AlbumDoc;
        const nextImages = (existing.images ?? []).filter((image) => image.id !== imageId);
        const doc = (await payload.update({
            collection: "albums",
            id,
            data: { images: nextImages },
        })) as AlbumDoc;
        return mapDoc(doc);
    }
}
