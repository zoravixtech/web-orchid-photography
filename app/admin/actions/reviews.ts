"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getReviewRepository, getMediaStorage } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import { REVIEWS_TAG } from "@/lib/data/reviews";
import type { Review, ReviewPlatform, ReviewType } from "@/lib/types";

export interface ReviewActionResult {
    error?: string;
    review?: Review;
}

export interface CreateReviewData {
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

export interface UpdateReviewData {
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

function validateReview(type: ReviewType, data: {
    name: string;
    stars: number;
    message?: string | null;
    platform?: ReviewPlatform | null;
    videoUrl?: string | null;
}): string | null {
    if (!data.name.trim()) return "Name is required.";
    if (!data.stars || data.stars < 1 || data.stars > 5) return "Rating must be between 1 and 5 stars.";

    if (type === "text") {
        if (!data.message?.trim()) return "Review message is required.";
        if (!data.platform || !["google", "facebook", "wedmegood"].includes(data.platform)) {
            return "Please select a valid platform (Google, Facebook, or WedMeGood).";
        }
    } else if (type === "video") {
        if (!data.videoUrl?.trim()) return "Video file is required.";
    }

    return null;
}

function revalidateReviewPaths() {
    revalidatePath("/");
    revalidatePath("/kidography");
    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");
}

export async function createReview(data: CreateReviewData): Promise<ReviewActionResult> {
    await requireAdmin();

    const error = validateReview(data.type, data);
    if (error) return { error };

    const repo = getReviewRepository();
    if (!repo) return { error: "Database is not configured." };

    const review = await repo.create({
        type: data.type,
        name: data.name.trim(),
        stars: Number(data.stars),
        userImage: data.userImage ?? null,
        userImageStoragePath: data.userImageStoragePath ?? null,
        message: data.type === "text" ? data.message?.trim() ?? null : null,
        platform: data.type === "text" ? data.platform ?? null : null,
        videoUrl: data.type === "video" ? data.videoUrl ?? null : null,
        videoStoragePath: data.type === "video" ? data.videoStoragePath ?? null : null,
        pinned: Boolean(data.pinned),
    });

    updateTag(REVIEWS_TAG);
    revalidateReviewPaths();

    return { review };
}

export async function updateReview(id: string, data: UpdateReviewData): Promise<ReviewActionResult> {
    await requireAdmin();

    const repo = getReviewRepository();
    if (!repo) return { error: "Database is not configured." };

    const existing = await repo.findById(id);
    if (!existing) return { error: "Review not found." };

    // Notice: Review type cannot be modified after creation!
    const error = validateReview(existing.type, data);
    if (error) return { error };

    // If new user image was uploaded and previous storage file exists and changed, clean up previous
    if (
        data.userImageStoragePath &&
        existing.userImageStoragePath &&
        data.userImageStoragePath !== existing.userImageStoragePath
    ) {
        const storage = getMediaStorage();
        if (storage) await storage.delete(existing.userImageStoragePath).catch(() => {});
    }

    // If new video was uploaded and previous storage file exists and changed, clean up previous
    if (
        data.videoStoragePath &&
        existing.videoStoragePath &&
        data.videoStoragePath !== existing.videoStoragePath
    ) {
        const storage = getMediaStorage();
        if (storage) await storage.delete(existing.videoStoragePath).catch(() => {});
    }

    const review = await repo.update(id, {
        name: data.name.trim(),
        stars: Number(data.stars),
        userImage: data.userImage ?? existing.userImage,
        userImageStoragePath: data.userImageStoragePath ?? existing.userImageStoragePath,
        message: existing.type === "text" ? data.message?.trim() ?? null : null,
        platform: existing.type === "text" ? data.platform ?? null : null,
        videoUrl: existing.type === "video" ? data.videoUrl ?? existing.videoUrl : null,
        videoStoragePath: existing.type === "video" ? data.videoStoragePath ?? existing.videoStoragePath : null,
        pinned: data.pinned !== undefined ? Boolean(data.pinned) : existing.pinned,
    });

    updateTag(REVIEWS_TAG);
    revalidateReviewPaths();

    return { review };
}

export async function deleteReview(id: string): Promise<ReviewActionResult> {
    await requireAdmin();

    const repo = getReviewRepository();
    if (!repo) return { error: "Database is not configured." };

    const existing = await repo.findById(id);
    if (!existing) return { error: "Review not found." };

    await repo.delete(id);

    // Clean up uploaded media in storage
    const storage = getMediaStorage();
    if (storage) {
        if (existing.userImageStoragePath) {
            await storage.delete(existing.userImageStoragePath).catch(() => {});
        }
        if (existing.videoStoragePath) {
            await storage.delete(existing.videoStoragePath).catch(() => {});
        }
    }

    updateTag(REVIEWS_TAG);
    revalidateReviewPaths();

    return {};
}

export async function togglePinReview(id: string): Promise<ReviewActionResult> {
    await requireAdmin();

    const repo = getReviewRepository();
    if (!repo) return { error: "Database is not configured." };

    const review = await repo.togglePin(id);

    updateTag(REVIEWS_TAG);
    revalidateReviewPaths();

    return { review };
}
