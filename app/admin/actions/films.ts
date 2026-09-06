"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getFilmRepository } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import { FILMS_TAG } from "@/lib/data/films";
import type { Film } from "@/lib/types";

export interface FilmActionResult {
    error?: string;
    film?: Film;
    success?: boolean;
}

export interface FilmValidationResult {
    valid: boolean;
    error?: string;
    videoId?: string;
    canonicalUrl?: string;
    title?: string;
    thumbnailUrl?: string;
}

export async function parseYouTubeVideoId(input: string): Promise<string | null> {
    if (!input || typeof input !== "string") return null;
    const trimmed = input.trim();

    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
    }

    const patterns = [
        /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.|m\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = trimmed.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

export async function fetchYouTubeMetadata(videoId: string): Promise<{ title: string; thumbnailUrl: string } | null> {
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const res = await fetch(oembedUrl, {
            cache: "no-store",
            signal: AbortSignal.timeout(6000),
        });

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return {
            title: data.title || "Wedding Film",
            thumbnailUrl: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        };
    } catch {
        return null;
    }
}

export async function validateYouTubeLink(rawUrl: string): Promise<FilmValidationResult> {
    const videoId = await parseYouTubeVideoId(rawUrl);
    if (!videoId) {
        return {
            valid: false,
            error: "Invalid YouTube URL format. Please provide a valid YouTube link (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)",
        };
    }

    const metadata = await fetchYouTubeMetadata(videoId);
    if (!metadata) {
        return {
            valid: false,
            error: "Video not found or is private/unavailable on YouTube.",
        };
    }

    return {
        valid: true,
        videoId,
        canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
        title: metadata.title,
        thumbnailUrl: metadata.thumbnailUrl,
    };
}

function revalidateFilmPaths() {
    updateTag(FILMS_TAG);
    revalidatePath("/");
    revalidatePath("/films");
    revalidatePath("/admin/films");
}

export async function createFilm(data: { youtubeUrl: string; title?: string }): Promise<FilmActionResult> {
    await requireAdmin();

    const validation = await validateYouTubeLink(data.youtubeUrl);
    if (!validation.valid || !validation.videoId || !validation.canonicalUrl || !validation.thumbnailUrl) {
        return { error: validation.error || "Failed to validate YouTube link." };
    }

    const repo = getFilmRepository();
    if (!repo) return { error: "Database is not configured." };

    const finalTitle = data.title?.trim() || validation.title || "Wedding Film";

    const film = await repo.create({
        title: finalTitle,
        youtubeUrl: validation.canonicalUrl,
        videoId: validation.videoId,
        thumbnailUrl: validation.thumbnailUrl,
    });

    revalidateFilmPaths();
    return { film, success: true };
}

export async function updateFilm(id: string, data: { youtubeUrl: string; title?: string }): Promise<FilmActionResult> {
    await requireAdmin();

    const validation = await validateYouTubeLink(data.youtubeUrl);
    if (!validation.valid || !validation.videoId || !validation.canonicalUrl || !validation.thumbnailUrl) {
        return { error: validation.error || "Failed to validate YouTube link." };
    }

    const repo = getFilmRepository();
    if (!repo) return { error: "Database is not configured." };

    const finalTitle = data.title?.trim() || validation.title || "Wedding Film";

    const film = await repo.update(id, {
        title: finalTitle,
        youtubeUrl: validation.canonicalUrl,
        videoId: validation.videoId,
        thumbnailUrl: validation.thumbnailUrl,
    });

    revalidateFilmPaths();
    return { film, success: true };
}

export async function deleteFilm(id: string): Promise<FilmActionResult> {
    await requireAdmin();

    const repo = getFilmRepository();
    if (!repo) return { error: "Database is not configured." };

    await repo.delete(id);
    revalidateFilmPaths();
    return { success: true };
}
