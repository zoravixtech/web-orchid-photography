import type { CollectionConfig } from "payload";

export const Films: CollectionConfig = {
    slug: "films",
    admin: {
        useAsTitle: "title",
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            name: "youtubeUrl",
            type: "text",
            required: true,
        },
        {
            name: "videoId",
            type: "text",
            required: true,
            index: true,
        },
        {
            name: "thumbnailUrl",
            type: "text",
            required: true,
        },
    ],
};
