import { create } from "zustand";
import { updateSettings, type UpdateSettingsInput } from "@/app/admin/actions/settings";
import type { SiteSettings } from "@/lib/types";

const EMPTY_SETTINGS: SiteSettings = {
    logoUrl: null,
    heroVideoUrl: null,
    kidsHeroVideoUrl: null,
    stats: { weddings: 0, preWeddings: 0, babyPhotoshoots: 0, corporateInterior: 0 },
    socialLinks: { whatsapp: null, facebook: null, instagram: null, youtube: null, linkedin: null },
};

interface AdminSettingsStore {
    settings: SiteSettings;
    hydrated: boolean;
    /** Seeds/refreshes from a fresh server fetch. */
    hydrate: (settings: SiteSettings) => void;
    /** Immediate local reflection for fields already persisted server-side (media uploads). */
    setField: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
    /** Optimistic: applies immediately, rolls back on server error. */
    save: (input: UpdateSettingsInput) => Promise<{ error?: string }>;
}

export const useAdminSettingsStore = create<AdminSettingsStore>((set, get) => ({
    settings: EMPTY_SETTINGS,
    hydrated: false,

    hydrate: (settings) => set({ settings, hydrated: true }),

    setField: (key, value) =>
        set((state) => ({ settings: { ...state.settings, [key]: value } })),

    save: async (input) => {
        const previous = get().settings;
        set({
            settings: {
                ...previous,
                logoUrl: input.logoUrl,
                stats: input.stats,
                socialLinks: input.socialLinks,
            },
        });

        const result = await updateSettings(input);
        if (result.error) set({ settings: previous });
        return result;
    },
}));
