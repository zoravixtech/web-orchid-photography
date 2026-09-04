"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getCareerRepository } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import { CAREERS_TAG } from "@/lib/data/careers";
import type { CareerPost } from "@/lib/types";

export interface CareerActionResult {
    error?: string;
    career?: CareerPost;
}

export interface CareerInput {
    title: string;
    description: string;
    link: string;
}

function validate(input: CareerInput): string | null {
    if (!input.title.trim()) return "Title is required.";
    if (!input.description.trim()) return "Description is required.";
    if (!input.link.trim()) return "Link is required.";
    return null;
}

function revalidateCareerPaths() {
    revalidatePath("/career");
    revalidatePath("/admin/career");
}

export async function createCareer(input: CareerInput): Promise<CareerActionResult> {
    await requireAdmin();
    const error = validate(input);
    if (error) return { error };

    const repo = getCareerRepository();
    if (!repo) return { error: "Database is not configured." };

    const career = await repo.create({
        title: input.title.trim(),
        description: input.description.trim(),
        link: input.link.trim(),
    });
    updateTag(CAREERS_TAG);
    revalidateCareerPaths();

    return { career };
}

export async function updateCareer(id: string, input: CareerInput): Promise<CareerActionResult> {
    await requireAdmin();
    const error = validate(input);
    if (error) return { error };

    const repo = getCareerRepository();
    if (!repo) return { error: "Database is not configured." };

    const career = await repo.update(id, {
        title: input.title.trim(),
        description: input.description.trim(),
        link: input.link.trim(),
    });
    updateTag(CAREERS_TAG);
    revalidateCareerPaths();

    return { career };
}

export async function deleteCareer(id: string): Promise<CareerActionResult> {
    await requireAdmin();

    const repo = getCareerRepository();
    if (!repo) return { error: "Database is not configured." };

    await repo.delete(id);
    updateTag(CAREERS_TAG);
    revalidateCareerPaths();

    return {};
}
