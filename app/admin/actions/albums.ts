"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAlbumRepository, getMediaStorage } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import { ALBUMS_TAG } from "@/lib/data/albums";
import type { Album, Org } from "@/lib/types";

export interface AlbumActionResult {
    error?: string;
    album?: Album;
}

// The cover image only stores its public URL (unlike album images, which
// also keep their raw storage key) — recover the R2 key from it so a
// deleted album doesn't leave its cover orphaned in storage.
function keyFromPublicUrl(url: string): string | null {
    const base = process.env.STORAGE_PUBLIC_URL_BASE?.replace(/\/$/, "");
    if (!base || !url.startsWith(`${base}/`)) return null;
    return url.slice(base.length + 1);
}

function revalidateAlbumPaths(org: Org) {
    revalidatePath("/");
    revalidatePath("/kidography");
    revalidatePath("/albums");
    revalidatePath("/kidography/albums");
    revalidatePath(`/admin/${org}/albums`);
}

export interface CreateAlbumFields {
    name: string;
    coverImage: string;
    coverPosition?: string;
    address?: string;
    venue?: string;
    category?: string;
}

export async function createAlbum(org: Org, input: CreateAlbumFields): Promise<AlbumActionResult> {
    await requireAdmin();
    if (!input.name.trim()) return { error: "Name is required." };
    if (!input.coverImage) return { error: "Cover image is required." };

    const repo = getAlbumRepository();
    if (!repo) return { error: "Database is not configured." };

    const album = await repo.create({
        org,
        name: input.name.trim(),
        coverImage: input.coverImage,
        coverPosition: input.coverPosition,
        address: input.address,
        venue: input.venue,
        category: input.category,
    });
    updateTag(ALBUMS_TAG);
    revalidateAlbumPaths(org);

    return { album };
}

export async function updateAlbum(
    id: string,
    org: Org,
    input: { name?: string; coverImage?: string; coverPosition?: string; address?: string; venue?: string; category?: string }
): Promise<AlbumActionResult> {
    await requireAdmin();

    const repo = getAlbumRepository();
    if (!repo) return { error: "Database is not configured." };

    // Replacing the cover leaves the old one orphaned in storage otherwise —
    // grab it before overwriting so it can be cleaned up after the DB write.
    const previousCoverImage =
        input.coverImage !== undefined ? (await repo.getById(id))?.coverImage : undefined;

    const album = await repo.update(id, input);
    updateTag(ALBUMS_TAG);
    revalidateAlbumPaths(org);

    if (previousCoverImage && previousCoverImage !== input.coverImage) {
        const storage = getMediaStorage();
        const key = storage ? keyFromPublicUrl(previousCoverImage) : null;
        if (storage && key) {
            await storage.delete(key).catch((e) => console.error(`Failed to delete old cover ${key}:`, e));
        }
    }

    return { album };
}

export async function deleteAlbum(id: string, org: Org): Promise<AlbumActionResult> {
    await requireAdmin();

    const repo = getAlbumRepository();
    if (!repo) return { error: "Database is not configured." };

    // Fetch before deleting so we still know which storage objects to clean
    // up afterward — the DB row is the source of truth, so it's deleted
    // first; storage cleanup follows and is best-effort (a failed delete
    // there shouldn't leave the album stuck in the admin panel).
    const existing = await repo.getById(id);
    await repo.delete(id);
    updateTag(ALBUMS_TAG);
    revalidateAlbumPaths(org);

    if (existing) {
        const storage = getMediaStorage();
        if (storage) {
            const coverKey = keyFromPublicUrl(existing.coverImage);
            const keys = [coverKey, ...existing.images.map((image) => image.storagePath)].filter(
                (key): key is string => Boolean(key)
            );
            await Promise.all(
                keys.map((key) =>
                    storage.delete(key).catch((e) => console.error(`Failed to delete storage file ${key}:`, e))
                )
            );
        }
    }

    return {};
}

export async function addAlbumImages(
    id: string,
    org: Org,
    images: { url: string; storagePath: string | null; alt: string }[]
): Promise<AlbumActionResult> {
    await requireAdmin();

    const repo = getAlbumRepository();
    if (!repo) return { error: "Database is not configured." };

    const album = await repo.addImages(id, images);
    updateTag(ALBUMS_TAG);
    revalidateAlbumPaths(org);

    return { album };
}

export async function removeAlbumImage(id: string, org: Org, imageId: string): Promise<AlbumActionResult> {
    await requireAdmin();

    const repo = getAlbumRepository();
    if (!repo) return { error: "Database is not configured." };

    const existing = await repo.getById(id);
    const image = existing?.images.find((img) => img.id === imageId);

    const album = await repo.removeImage(id, imageId);

    if (image?.storagePath) {
        const storage = getMediaStorage();
        if (storage) await storage.delete(image.storagePath);
    }

    updateTag(ALBUMS_TAG);
    revalidateAlbumPaths(org);

    return { album };
}
