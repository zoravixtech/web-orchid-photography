import type { CollectionConfig } from "payload";

export const Blogs: CollectionConfig = {
    slug: "blogs",
    admin: {
        useAsTitle: "title",
    },
    fields: [
        { name: "slug", type: "text", required: true, unique: true },
        { name: "title", type: "text", required: true },
        { name: "date", type: "text", required: true },
        { name: "image", type: "text", required: true },
        { name: "excerpt", type: "text", required: true },
        { name: "content", type: "json", required: true, defaultValue: [] },
        { name: "views", type: "number", required: true, defaultValue: 0 },
    ],
};
