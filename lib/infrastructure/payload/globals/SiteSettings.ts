import type { GlobalConfig } from "payload";

// One global per org (rather than a single global with an org selector)
// keeps each org's settings a true singleton document with no shared-state
// footgun between the two switcher tabs.
function siteSettingsGlobal(slug: string): GlobalConfig {
    return {
        slug,
        fields: [
            { name: "heroVideoUrl", type: "text" },
            {
                name: "stats",
                type: "group",
                fields: [
                    { name: "weddings", type: "number", required: true, defaultValue: 800 },
                    { name: "preWeddings", type: "number", required: true, defaultValue: 500 },
                    { name: "babyPhotoshoots", type: "number", required: true, defaultValue: 250 },
                    { name: "corporateInterior", type: "number", required: true, defaultValue: 20 },
                ],
            },
            {
                name: "socialLinks",
                type: "group",
                fields: [
                    { name: "whatsapp", type: "text" },
                    { name: "facebook", type: "text" },
                    { name: "instagram", type: "text" },
                    { name: "youtube", type: "text" },
                    { name: "linkedin", type: "text" },
                ],
            },
        ],
    };
}

export const SiteSettingsOrchid: GlobalConfig = siteSettingsGlobal("site-settings-orchid");
export const SiteSettingsKidography: GlobalConfig = siteSettingsGlobal("site-settings-kidography");

// Deprecated — superseded by the two per-org globals above (data copied
// over by scripts/migrate-org-schema.mts). Kept registered (unused by any
// app code) purely so schema push treats this table as unchanged instead of
// pairing its removal with one of the new tables above as an ambiguous
// "rename" against a live database. Safe to drop in a dedicated, attended
// migration later.
export const SiteSettingsLegacy: GlobalConfig = {
    slug: "site-settings",
    fields: [
        { name: "logoUrl", type: "text" },
        { name: "heroVideoUrl", type: "text" },
        { name: "kidsHeroVideoUrl", type: "text" },
        {
            name: "stats",
            type: "group",
            fields: [
                { name: "weddings", type: "number" },
                { name: "preWeddings", type: "number" },
                { name: "babyPhotoshoots", type: "number" },
                { name: "corporateInterior", type: "number" },
            ],
        },
        {
            name: "socialLinks",
            type: "group",
            fields: [
                { name: "whatsapp", type: "text" },
                { name: "facebook", type: "text" },
                { name: "instagram", type: "text" },
                { name: "youtube", type: "text" },
                { name: "linkedin", type: "text" },
            ],
        },
    ],
};
