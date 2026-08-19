import type { CollectionConfig } from "payload";

export const GalleryMedia: CollectionConfig = {
    slug: "gallery-media",
    admin: {
        useAsTitle: "alt",
    },
    fields: [
        {
            name: "section",
            type: "select",
            required: true,
            options: [
                { label: "Gallery", value: "gallery" },
                { label: "Kids", value: "kids" },
            ],
        },
        { name: "url", type: "text", required: true },
        { name: "alt", type: "text", required: true, defaultValue: "" },
        { name: "storagePath", type: "text" },
    ],
};
