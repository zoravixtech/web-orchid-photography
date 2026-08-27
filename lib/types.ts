export type GallerySection = "gallery" | "kids";

export interface GalleryMediaItem {
    id: string;
    section: GallerySection;
    url: string;
    alt: string;
    storagePath: string | null;
    createdAt: string;
}

export type BlogBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; text: string };

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    date: string;
    image: string;
    excerpt: string;
    views: number;
    content: BlogBlock[];
    createdAt: string;
    updatedAt: string;
}

export interface StatsCounters {
    weddings: number;
    preWeddings: number;
    babyPhotoshoots: number;
    corporateInterior: number;
}

export interface SocialLinks {
    whatsapp: string | null;
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
    linkedin: string | null;
}

export interface SiteSettings {
    logoUrl: string | null;
    heroVideoUrl: string | null;
    kidsHeroVideoUrl: string | null;
    stats: StatsCounters;
    socialLinks: SocialLinks;
}

export const BLOG_DATE_FORMAT: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
};

export function formatBlogDate(isoDate: string): string {
    const date = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) return isoDate;
    return date.toLocaleDateString("en-GB", BLOG_DATE_FORMAT);
}