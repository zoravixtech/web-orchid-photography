import { unstable_cache } from "next/cache";
import { getReviewRepository } from "@/lib/infrastructure";
import type { Review } from "@/lib/types";

export const REVIEWS_TAG = "reviews";

export const getReviews = unstable_cache(
    async (): Promise<Review[]> => {
        const repo = getReviewRepository();
        if (!repo) return [];
        return repo.list();
    },
    ["reviews"],
    { revalidate: 86400, tags: [REVIEWS_TAG] }
);

export const getPinnedReviews = unstable_cache(
    async (): Promise<Review[]> => {
        const repo = getReviewRepository();
        if (!repo) return [];
        return repo.listPinned();
    },
    ["reviews-pinned"],
    { revalidate: 86400, tags: [REVIEWS_TAG] }
);
