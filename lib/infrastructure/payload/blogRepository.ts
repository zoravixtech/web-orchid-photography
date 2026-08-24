import type { Payload } from "payload";
import type {
    BlogRepository,
    CreateBlogInput,
    UpdateBlogInput,
} from "@/lib/repositories/blogRepository";
import type { BlogBlock, BlogPost } from "@/lib/types";

interface BlogDoc {
    id: string | number;
    slug: string;
    title: string;
    date: string;
    image: string;
    excerpt: string;
    views: number;
    content: unknown;
    createdAt: string;
    updatedAt: string;
}

import { normalizeMediaUrl } from "@/lib/utils/mediaUrl";

function mapDoc(doc: BlogDoc): BlogPost {
    return {
        id: String(doc.id),
        slug: doc.slug,
        title: doc.title,
        date: doc.date,
        image: normalizeMediaUrl(doc.image),
        excerpt: doc.excerpt,
        views: doc.views ?? 0,
        content: Array.isArray(doc.content) ? (doc.content as BlogBlock[]) : [],
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}

/**
 * Takes a Promise<Payload> (not an already-resolved client) so callers
 * (lib/infrastructure/index.ts) can keep their repository getters
 * synchronous, matching the previous Postgres-backed repositories' shape —
 * every method here just awaits it first.
 */
export class PayloadBlogRepository implements BlogRepository {
    constructor(private payloadPromise: Promise<Payload>) {}

    async list(): Promise<BlogPost[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "blogs",
            sort: "-date",
            limit: 0,
        });
        return (docs as BlogDoc[]).map(mapDoc);
    }

    async listSlugs(): Promise<string[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "blogs",
            limit: 0,
            select: { slug: true },
        });
        return (docs as { slug: string }[]).map((doc) => doc.slug);
    }

    async findBySlug(slug: string): Promise<BlogPost | null> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "blogs",
            where: { slug: { equals: slug } },
            limit: 1,
        });
        const doc = docs[0] as BlogDoc | undefined;
        return doc ? mapDoc(doc) : null;
    }

    async findById(id: string): Promise<BlogPost | null> {
        const payload = await this.payloadPromise;
        try {
            const doc = (await payload.findByID({ collection: "blogs", id })) as BlogDoc;
            return mapDoc(doc);
        } catch {
            return null;
        }
    }

    async slugExists(slug: string, excludeId?: string): Promise<boolean> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "blogs",
            where: excludeId
                ? { and: [{ slug: { equals: slug } }, { id: { not_equals: excludeId } }] }
                : { slug: { equals: slug } },
            limit: 1,
        });
        return docs.length > 0;
    }

    async create(data: CreateBlogInput): Promise<BlogPost> {
        const payload = await this.payloadPromise;
        const doc = (await payload.create({
            collection: "blogs",
            data: { ...data, views: 0 },
        })) as BlogDoc;
        return mapDoc(doc);
    }

    async update(id: string, data: UpdateBlogInput): Promise<BlogPost> {
        const payload = await this.payloadPromise;
        const doc = (await payload.update({
            collection: "blogs",
            id,
            data,
        })) as BlogDoc;
        return mapDoc(doc);
    }

    async delete(id: string): Promise<void> {
        const payload = await this.payloadPromise;
        await payload.delete({ collection: "blogs", id });
    }
}
