import type { CollectionConfig } from "payload";

export const GalleryMedia: CollectionConfig = {
    slug: "gallery-media",
    admin: {
        useAsTitle: "alt",
    },
    fields: [
        {
            name: "org",
            type: "select",
            // Not DB-required: this column is being added to a table that
            // already has rows (backfilled separately by
            // scripts/migrate-org-schema.mts) — every write path in the app
            // always supplies it regardless.
            options: [
                { label: "Orchid", value: "orchid" },
                { label: "Kidography", value: "kidography" },
            ],
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
        },
        { name: "url", type: "text", required: true },
        { name: "alt", type: "text", required: true, defaultValue: "" },
        { name: "storagePath", type: "text" },
        { name: "pinned", type: "checkbox", defaultValue: false },
        // Deprecated — superseded by `org`/`category` above. Kept (unused by
        // any app code) purely so schema push only ever ADDS columns here
        // instead of pairing this column's removal with `org`'s addition as
        // an ambiguous "rename" against a live database. Safe to drop in a
        // dedicated, attended migration later.
        {
            name: "section",
            type: "select",
            options: [
                { label: "Gallery", value: "gallery" },
                { label: "Kids", value: "kids" },
            ],
        },
    ],
};
