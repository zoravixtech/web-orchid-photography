import { unstable_cache } from "next/cache";
import { getFilmRepository } from "@/lib/infrastructure";
import type { Film } from "@/lib/types";

export const FILMS_TAG = "films";

export const getFilms = unstable_cache(
    async (): Promise<Film[]> => {
        const repo = getFilmRepository();
        if (!repo) return [];
        return repo.list();
    },
    ["films"],
    { revalidate: 86400, tags: [FILMS_TAG] }
);
