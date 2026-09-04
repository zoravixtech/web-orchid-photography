import { unstable_cache } from "next/cache";
import { getCareerRepository } from "@/lib/infrastructure";
import type { CareerPost } from "@/lib/types";

export const CAREERS_TAG = "careers";

export const getCareers = unstable_cache(
    async (): Promise<CareerPost[]> => {
        const repo = getCareerRepository();
        if (!repo) return [];
        return repo.list();
    },
    ["careers"],
    { revalidate: 86400, tags: [CAREERS_TAG] }
);
