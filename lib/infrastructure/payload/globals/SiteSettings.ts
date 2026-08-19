import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
    slug: "site-settings",
    fields: [
        { name: "logoUrl", type: "text", defaultValue: "/favicon.webp" },
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
