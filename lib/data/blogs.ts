import { unstable_cache } from "next/cache";
import { getBlogRepository } from "@/lib/infrastructure";
import type { BlogPost } from "@/lib/types";

export const BLOGS_TAG = "blogs";

export const getBlogs = unstable_cache(
    async (): Promise<BlogPost[]> => {
        const repo = getBlogRepository();
        if (!repo) return [];
        return repo.list();
    },
    ["blogs-list"],
    { revalidate: 86400, tags: [BLOGS_TAG] }
);

export const getBlogBySlug = unstable_cache(
    async (slug: string): Promise<BlogPost | null> => {
        const repo = getBlogRepository();
        if (!repo) return null;
        return repo.findBySlug(slug);
    },
    ["blog-by-slug"],
    { revalidate: 86400, tags: [BLOGS_TAG] }
);

export const getAllBlogSlugs = unstable_cache(
    async (): Promise<string[]> => {
        const repo = getBlogRepository();
        if (!repo) return [];
        return repo.listSlugs();
    },
    ["blog-slugs"],
    { revalidate: 86400, tags: [BLOGS_TAG] }
);
