"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getSettingsRepository } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import type { SocialLinks } from "@/lib/types";

export interface SettingsActionResult {
    error?: string;
    success?: boolean;
}

const STAT_FIELDS = ["weddings", "preWeddings", "babyPhotoshoots", "corporateInterior"] as const;

function readStatValue(formData: FormData, field: string): number {
    const raw = Number(formData.get(field) ?? 0);
    if (!Number.isFinite(raw) || raw < 0) return 0;
    return Math.round(raw);
}

function readSocialValue(formData: FormData, field: string): string | null {
    const raw = String(formData.get(field) ?? "").trim();
    return raw || null;
}

export async function updateSettings(formData: FormData): Promise<SettingsActionResult> {
    await requireAdmin();

    const logoUrl = String(formData.get("logo_url") ?? "").trim();
    const heroVideoUrl = String(formData.get("hero_video_url") ?? "").trim();
    const stats = Object.fromEntries(
        STAT_FIELDS.map((field) => [field, readStatValue(formData, field)])
    ) as Record<(typeof STAT_FIELDS)[number], number>;
    const socialLinks: SocialLinks = {
        whatsapp: readSocialValue(formData, "social_whatsapp"),
        facebook: readSocialValue(formData, "social_facebook"),
        instagram: readSocialValue(formData, "social_instagram"),
        youtube: readSocialValue(formData, "social_youtube"),
        linkedin: readSocialValue(formData, "social_linkedin"),
    };

    const repo = getSettingsRepository();
    if (!repo) return { error: "Database is not configured." };

    await repo.update({
        logoUrl: logoUrl || null,
        heroVideoUrl: heroVideoUrl || null,
        stats,
        socialLinks,
    });

    updateTag("settings");
    revalidatePath("/", "layout");

    return { success: true };
}
