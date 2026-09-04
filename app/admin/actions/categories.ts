"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getCategoryRepository } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import { CATEGORIES_TAG } from "@/lib/data/categories";
import type { Category, Org } from "@/lib/types";

export interface CategoryActionResult {
    error?: string;
    category?: Category;
}

export async function createCategory(org: Org, name: string): Promise<CategoryActionResult> {
    await requireAdmin();
    if (!name.trim()) return { error: "Name is required." };

    const repo = getCategoryRepository();
    if (!repo) return { error: "Database is not configured." };

    const category = await repo.create({ org, name: name.trim() });
    updateTag(CATEGORIES_TAG);
    revalidatePath(`/admin/${org}/categories`);
    revalidatePath(`/admin/${org}/gallery`);

    return { category };
}

export async function updateCategory(id: string, org: Org, name: string): Promise<CategoryActionResult> {
    await requireAdmin();
    if (!name.trim()) return { error: "Name is required." };

    const repo = getCategoryRepository();
    if (!repo) return { error: "Database is not configured." };

    const category = await repo.update(id, { name: name.trim() });
    updateTag(CATEGORIES_TAG);
    revalidatePath(`/admin/${org}/categories`);
    revalidatePath(`/admin/${org}/gallery`);

    return { category };
}

export async function deleteCategory(id: string, org: Org): Promise<CategoryActionResult> {
    await requireAdmin();

    const repo = getCategoryRepository();
    if (!repo) return { error: "Database is not configured." };

    await repo.delete(id);
    updateTag(CATEGORIES_TAG);
    revalidatePath(`/admin/${org}/categories`);
    revalidatePath(`/admin/${org}/gallery`);

    return {};
}
