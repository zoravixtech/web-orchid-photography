import type { Audience } from "@/lib/config/domain";

// The two independent content organizations managed from the admin panel's
// team switcher. Deliberately the same union as Audience (domain.ts) — an
// org's public site is reached at the matching audience's domain — but kept
// as a separate alias since "Org" is the DB/admin-facing vocabulary while
// "Audience" is the hostname-detection vocabulary.
export type Org = Audience;

export interface GalleryMediaItem {
    id: string;
    org: Org;
    categoryId: string;
    url: string;
    alt: string;
    storagePath: string | null;
    pinned: boolean;
    createdAt: string;
}

export interface Category {
    id: string;
    org: Org;
    name: string;
}

export interface AlbumImage {
    id: string;
    url: string;
    storagePath: string | null;
    alt: string;
}

export interface Album {
    id: string;
    org: Org;
    name: string;
    slug: string;
    coverImage: string;
    /** CSS `object-position` value, e.g. "50% 50%". */
    coverPosition: string;
    address: string;
    venue: string;
    category: string;
    images: AlbumImage[];
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

export interface CareerPost {
    id: string;
    title: string;
    description: string;
    link: string;
    createdAt: string;
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
    heroVideoUrl: string | null;
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
