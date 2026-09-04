import { unstable_cache } from "next/cache";
import { getCategoryRepository } from "@/lib/infrastructure";
import type { Category, Org } from "@/lib/types";

export const CATEGORIES_TAG = "categories";

export const getCategories = unstable_cache(
    async (org: Org): Promise<Category[]> => {
        const repo = getCategoryRepository();
        if (!repo) return [];
        return repo.list(org);
    },
    ["categories"],
    { revalidate: 86400, tags: [CATEGORIES_TAG] }
);
