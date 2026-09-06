import type { CollectionConfig } from "payload";

export const Reviews: CollectionConfig = {
    slug: "reviews",
    admin: {
        useAsTitle: "name",
    },
    fields: [
        {
            name: "type",
            type: "select",
            required: true,
            defaultValue: "text",
            options: [
                { label: "Text", value: "text" },
                { label: "Video", value: "video" },
            ],
        },
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "stars",
            type: "number",
            required: true,
            min: 1,
            max: 5,
            defaultValue: 5,
        },
        {
            name: "userImage",
            type: "text",
        },
        {
            name: "userImageStoragePath",
            type: "text",
        },
        {
            name: "message",
            type: "textarea",
        },
        {
            name: "platform",
            type: "select",
            options: [
                { label: "Google", value: "google" },
                { label: "Facebook", value: "facebook" },
                { label: "WedMeGood", value: "wedmegood" },
            ],
        },
        {
            name: "videoUrl",
            type: "text",
        },
        {
            name: "videoStoragePath",
            type: "text",
        },
        {
            name: "pinned",
            type: "checkbox",
            defaultValue: false,
        },
    ],
};
