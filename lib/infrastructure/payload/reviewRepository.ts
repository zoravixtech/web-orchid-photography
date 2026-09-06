import type { Payload } from "payload";
import type {
    CreateReviewInput,
    ReviewRepository,
    UpdateReviewInput,
} from "@/lib/repositories/reviewRepository";
import type { Review, ReviewPlatform, ReviewType } from "@/lib/types";
import { normalizeMediaUrl } from "@/lib/utils/mediaUrl";

interface ReviewDoc {
    id: string | number;
    type: "text" | "video";
    name: string;
    stars: number;
    userImage?: string | null;
    userImageStoragePath?: string | null;
    message?: string | null;
    platform?: "google" | "facebook" | "wedmegood" | null;
    videoUrl?: string | null;
    videoStoragePath?: string | null;
    pinned?: boolean | null;
    createdAt: string;
}

function mapDoc(doc: ReviewDoc): Review {
    return {
        id: String(doc.id),
        type: doc.type as ReviewType,
        name: doc.name,
        stars: Number(doc.stars) || 5,
        userImage: doc.userImage ? normalizeMediaUrl(doc.userImage, doc.userImageStoragePath) : null,
        userImageStoragePath: doc.userImageStoragePath ?? null,
        message: doc.message ?? null,
        platform: (doc.platform as ReviewPlatform) ?? null,
        videoUrl: doc.videoUrl ? normalizeMediaUrl(doc.videoUrl, doc.videoStoragePath) : null,
        videoStoragePath: doc.videoStoragePath ?? null,
        pinned: Boolean(doc.pinned),
        createdAt: doc.createdAt,
    };
}

export class PayloadReviewRepository implements ReviewRepository {
    constructor(private payloadPromise: Promise<Payload>) {}

    async list(): Promise<Review[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "reviews",
            sort: "-createdAt",
            limit: 0,
        });
        return (docs as unknown as ReviewDoc[]).map(mapDoc);
    }

    async listPinned(): Promise<Review[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "reviews",
            where: {
                pinned: { equals: true },
            },
            sort: "-createdAt",
            limit: 0,
        });
        return (docs as unknown as ReviewDoc[]).map(mapDoc);
    }

    async findById(id: string): Promise<Review | null> {
        const payload = await this.payloadPromise;
        try {
            const doc = (await payload.findByID({ collection: "reviews", id: Number(id) || id })) as unknown as ReviewDoc;
            return mapDoc(doc);
        } catch {
            return null;
        }
    }

    async create(input: CreateReviewInput): Promise<Review> {
        const payload = await this.payloadPromise;
        const doc = (await payload.create({
            collection: "reviews",
            data: {
                type: input.type,
                name: input.name,
                stars: input.stars,
                userImage: input.userImage,
                userImageStoragePath: input.userImageStoragePath,
                message: input.message,
                platform: input.platform,
                videoUrl: input.videoUrl,
                videoStoragePath: input.videoStoragePath,
                pinned: input.pinned,
            },
        })) as unknown as ReviewDoc;
        return mapDoc(doc);
    }

    async update(id: string, input: UpdateReviewInput): Promise<Review> {
        const payload = await this.payloadPromise;
        const doc = (await payload.update({
            collection: "reviews",
            id: Number(id) || id,
            data: input as unknown as Record<string, unknown>,
        })) as unknown as ReviewDoc;
        return mapDoc(doc);
    }

    async delete(id: string): Promise<void> {
        const payload = await this.payloadPromise;
        await payload.delete({ collection: "reviews", id: Number(id) || id });
    }

    async togglePin(id: string): Promise<Review> {
        const payload = await this.payloadPromise;
        const current = (await payload.findByID({ collection: "reviews", id: Number(id) || id })) as unknown as ReviewDoc;
        const nextPinned = !Boolean(current.pinned);
        const doc = (await payload.update({
            collection: "reviews",
            id: Number(id) || id,
            data: { pinned: nextPinned },
        })) as unknown as ReviewDoc;
        return mapDoc(doc);
    }
}
