import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
    slug: "categories",
    admin: {
        useAsTitle: "name",
    },
    fields: [
        {
            name: "org",
            type: "select",
            required: true,
            options: [
                { label: "Orchid", value: "orchid" },
                { label: "Kidography", value: "kidography" },
            ],
        },
        { name: "name", type: "text", required: true },
    ],
};
