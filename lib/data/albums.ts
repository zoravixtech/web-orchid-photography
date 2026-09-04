import { unstable_cache } from "next/cache";
import { getAlbumRepository } from "@/lib/infrastructure";
import type { Album, Org } from "@/lib/types";

export const ALBUMS_TAG = "albums";

export const getAlbums = unstable_cache(
    async (org: Org): Promise<Album[]> => {
        const repo = getAlbumRepository();
        if (!repo) return [];
        return repo.list(org);
    },
    ["albums"],
    { revalidate: 86400, tags: [ALBUMS_TAG] }
);

export const getAlbumBySlug = unstable_cache(
    async (org: Org, slug: string): Promise<Album | null> => {
        const repo = getAlbumRepository();
        if (!repo) return null;
        return repo.getBySlug(org, slug);
    },
    ["album-by-slug"],
    { revalidate: 86400, tags: [ALBUMS_TAG] }
);
