import type { CollectionConfig } from "payload";

// A selection table: each row just points at a gallery-media image that
// should appear in the homepage hero carousel. No ordering/extra metadata —
// the carousel renders selected images in the same order as the gallery.
export const HeroCarousel: CollectionConfig = {
    slug: "hero-carousel",
    admin: {
        useAsTitle: "media",
    },
    fields: [
        {
            name: "media",
            type: "relationship",
            relationTo: "gallery-media",
            required: true,
            unique: true,
        },
    ],
};
