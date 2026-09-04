import type { CollectionConfig } from "payload";

// Shared across both orgs (not org-scoped) — a single job board regardless
// of which domain the visitor is on.
export const Careers: CollectionConfig = {
    slug: "careers",
    admin: {
        useAsTitle: "title",
    },
    fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "link", type: "text", required: true },
    ],
};
