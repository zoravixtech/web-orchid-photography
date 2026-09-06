import type { Film } from "@/lib/types";

export interface CreateFilmInput {
    title: string;
    youtubeUrl: string;
    videoId: string;
    thumbnailUrl: string;
}

export interface UpdateFilmInput {
    title?: string;
    youtubeUrl?: string;
    videoId?: string;
    thumbnailUrl?: string;
}

export interface FilmRepository {
    list(): Promise<Film[]>;
    findById(id: string): Promise<Film | null>;
    create(input: CreateFilmInput): Promise<Film>;
    update(id: string, input: UpdateFilmInput): Promise<Film>;
    delete(id: string): Promise<void>;
}
