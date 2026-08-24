import type { MetadataRoute } from "next";
import { getAllBlogSlugs } from "@/lib/data/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://web-orchid-photography.vercel.app";

    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/kidography`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
    ];

    try {
        const blogSlugs = await getAllBlogSlugs();
        blogSlugs.forEach((slug) => {
            routes.push({
                url: `${baseUrl}/blog/${slug}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.7,
            });
        });
    } catch {
        // Fallback gracefully if database is unreachable at build time
    }

    return routes;
}
