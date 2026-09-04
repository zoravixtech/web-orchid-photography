"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getSettingsRepository } from "@/lib/infrastructure";
import { requireAdmin } from "@/lib/auth/session";
import { SETTINGS_TAG } from "@/lib/data/settings";
import type { Org, SocialLinks, StatsCounters } from "@/lib/types";

export interface SettingsActionResult {
    error?: string;
    success?: boolean;
}

export interface UpdateSettingsInput {
    stats: StatsCounters;
    socialLinks: SocialLinks;
}

export async function updateSettings(org: Org, input: UpdateSettingsInput): Promise<SettingsActionResult> {
    await requireAdmin();

    const repo = getSettingsRepository();
    if (!repo) return { error: "Database is not configured." };

    await repo.update(org, {
        // Hero video URL is read-only here (persisted immediately via the
        // dedicated upload flow in /api/admin/upload) — omitted so this save
        // doesn't clobber it.
        stats: input.stats,
        socialLinks: input.socialLinks,
    });

    updateTag(SETTINGS_TAG);
    revalidatePath("/", "layout");

    return { success: true };
}
