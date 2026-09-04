import { create } from "zustand";
import { updateSettings, type UpdateSettingsInput } from "@/app/admin/actions/settings";
import type { Org, SiteSettings } from "@/lib/types";

const EMPTY_SETTINGS: SiteSettings = {
    heroVideoUrl: null,
    stats: { weddings: 0, preWeddings: 0, babyPhotoshoots: 0, corporateInterior: 0 },
    socialLinks: { whatsapp: null, facebook: null, instagram: null, youtube: null, linkedin: null },
};

interface AdminSettingsStore {
    byOrg: Record<Org, SiteSettings>;
    /** Seeds/refreshes from a fresh server fetch. */
    hydrate: (org: Org, settings: SiteSettings) => void;
    /** Immediate local reflection for fields already persisted server-side (media uploads). */
    setField: <K extends keyof SiteSettings>(org: Org, key: K, value: SiteSettings[K]) => void;
    /** Optimistic: applies immediately, rolls back on server error. */
    save: (org: Org, input: UpdateSettingsInput) => Promise<{ error?: string }>;
}

export const useAdminSettingsStore = create<AdminSettingsStore>((set, get) => ({
    byOrg: { orchid: EMPTY_SETTINGS, kidography: EMPTY_SETTINGS },

    hydrate: (org, settings) => set((state) => ({ byOrg: { ...state.byOrg, [org]: settings } })),

    setField: (org, key, value) =>
        set((state) => ({
            byOrg: { ...state.byOrg, [org]: { ...state.byOrg[org], [key]: value } },
        })),

    save: async (org, input) => {
        const previous = get().byOrg[org];
        set((state) => ({
            byOrg: {
                ...state.byOrg,
                [org]: { ...previous, stats: input.stats, socialLinks: input.socialLinks },
            },
        }));

        const result = await updateSettings(org, input);
        if (result.error) set((state) => ({ byOrg: { ...state.byOrg, [org]: previous } }));
        return result;
    },
}));
