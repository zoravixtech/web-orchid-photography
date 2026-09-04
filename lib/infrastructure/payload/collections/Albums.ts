import type { CollectionConfig } from "payload";

function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "album";
}

export const Albums: CollectionConfig = {
    slug: "albums",
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
        { name: "slug", type: "text", unique: true, index: true },
        { name: "coverImage", type: "text", required: true },
        {
            name: "images",
            type: "array",
            fields: [
                { name: "url", type: "text", required: true },
                { name: "storagePath", type: "text" },
                { name: "alt", type: "text", defaultValue: "" },
            ],
        },
    ],
    hooks: {
        beforeValidate: [
            async ({ data, req, originalDoc }) => {
                if (!data) return data;

                const name = data.name ?? originalDoc?.name;
                const org = data.org ?? originalDoc?.org;
                if (!name || !org) return data;

                // Only (re)generate the slug when the name actually changed —
                // admins editing other fields shouldn't see their custom URL
                // shift under them.
                if (data.slug && data.slug === originalDoc?.slug && name === originalDoc?.name) {
                    return data;
                }

                const base = slugify(name);
                let candidate = base;
                let suffix = 2;

                for (;;) {
                    const { docs } = await req.payload.find({
                        collection: "albums",
                        where: {
                            and: [
                                { org: { equals: org } },
                                { slug: { equals: candidate } },
                                ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
                            ],
                        },
                        limit: 1,
                    });
                    if (docs.length === 0) break;
                    candidate = `${base}-${suffix}`;
                    suffix += 1;
                }

                data.slug = candidate;
                return data;
            },
        ],
    },
};
