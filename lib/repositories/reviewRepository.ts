import type { Review, ReviewPlatform, ReviewType } from "@/lib/types";

export interface CreateReviewInput {
    type: ReviewType;
    name: string;
    stars: number;
    userImage?: string | null;
    userImageStoragePath?: string | null;
    message?: string | null;
    platform?: ReviewPlatform | null;
    videoUrl?: string | null;
    videoStoragePath?: string | null;
    pinned?: boolean;
}

export interface UpdateReviewInput {
    name?: string;
    stars?: number;
    userImage?: string | null;
    userImageStoragePath?: string | null;
    message?: string | null;
    platform?: ReviewPlatform | null;
    videoUrl?: string | null;
    videoStoragePath?: string | null;
    pinned?: boolean;
}

export interface ReviewRepository {
    list(): Promise<Review[]>;
    listPinned(): Promise<Review[]>;
    findById(id: string): Promise<Review | null>;
    create(input: CreateReviewInput): Promise<Review>;
    update(id: string, input: UpdateReviewInput): Promise<Review>;
    delete(id: string): Promise<void>;
    togglePin(id: string): Promise<Review>;
}
