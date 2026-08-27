"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getBlogRepository } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import { BLOGS_TAG } from "@/lib/data/blogs";
import type { BlogBlock, BlogPost } from "@/lib/types";

export interface BlogActionResult {
    error?: string;
    success?: boolean;
    post?: BlogPost;
}

function slugify(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}

function parseContent(raw: string): BlogBlock[] | null {
    try {
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;
        const blocks: BlogBlock[] = [];
        for (const block of parsed) {
            if (
                block &&
                typeof block === "object" &&
                (block.type === "paragraph" || block.type === "heading") &&
                typeof block.text === "string"
            ) {
                blocks.push({ type: block.type, text: block.text });
            } else {
                return null;
            }
        }
        return blocks;
    } catch {
        return null;
    }
}

function readCommonFields(formData: FormData) {
    return {
        title: String(formData.get("title") ?? "").trim(),
        slugInput: String(formData.get("slug") ?? "").trim(),
        date: String(formData.get("date") ?? "").trim(),
        image: String(formData.get("image") ?? "").trim(),
        excerpt: String(formData.get("excerpt") ?? "").trim(),
        content: parseContent(String(formData.get("content") ?? "[]")),
    };
}

function validateFields(fields: ReturnType<typeof readCommonFields>) {
    if (!fields.title) return "Title is required.";
    if (!fields.date) return "Date is required.";
    if (!fields.image) return "Cover image is required.";
    if (!fields.excerpt) return "Excerpt is required.";
    if (!fields.content || fields.content.length === 0) return "At least one content block is required.";
    return null;
}

function revalidateBlogRoutes() {
    updateTag(BLOGS_TAG);
    revalidatePath("/", "layout");
    revalidatePath("/blog");
    revalidatePath("/(public)/blog/[slug]", "page");
    revalidatePath("/blog/[slug]", "page");
}

export async function createBlog(
    _prevState: BlogActionResult,
    formData: FormData
): Promise<BlogActionResult> {
    await requireAdmin();

    const repo = getBlogRepository();
    if (!repo) return { error: "Database is not configured." };

    const fields = readCommonFields(formData);
    const validationError = validateFields(fields);
    if (validationError) return { error: validationError };

    const slug = fields.slugInput || slugify(fields.title);
    if (!slug) return { error: "Could not generate a slug from the title." };

    if (await repo.slugExists(slug)) {
        return { error: "A blog with this slug already exists. Choose a different slug." };
    }

    const post = await repo.create({
        slug,
        title: fields.title,
        date: fields.date,
        image: fields.image,
        excerpt: fields.excerpt,
        content: fields.content!,
    });

    revalidateBlogRoutes();
    return { success: true, post };
}

export async function updateBlog(
    id: string,
    _prevState: BlogActionResult,
    formData: FormData
): Promise<BlogActionResult> {
    await requireAdmin();

    const repo = getBlogRepository();
    if (!repo) return { error: "Database is not configured." };

    const fields = readCommonFields(formData);
    const validationError = validateFields(fields);
    if (validationError) return { error: validationError };

    const slug = fields.slugInput || slugify(fields.title);
    if (!slug) return { error: "Could not generate a slug from the title." };

    if (await repo.slugExists(slug, id)) {
        return { error: "A blog with this slug already exists. Choose a different slug." };
    }

    const post = await repo.update(id, {
        slug,
        title: fields.title,
        date: fields.date,
        image: fields.image,
        excerpt: fields.excerpt,
        content: fields.content!,
    });

    revalidateBlogRoutes();
    return { success: true, post };
}

export async function deleteBlog(id: string): Promise<BlogActionResult> {
    await requireAdmin();

    const repo = getBlogRepository();
    if (!repo) return { error: "Database is not configured." };

    await repo.delete(id);

    revalidateBlogRoutes();
    return { success: true };
}
