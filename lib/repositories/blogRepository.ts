import type { BlogBlock, BlogPost } from "@/lib/types";

export interface CreateBlogInput {
    slug: string;
    title: string;
    date: string;
    image: string;
    excerpt: string;
    content: BlogBlock[];
}

export type UpdateBlogInput = CreateBlogInput;

export interface BlogRepository {
    list(): Promise<BlogPost[]>;
    listSlugs(): Promise<string[]>;
    findBySlug(slug: string): Promise<BlogPost | null>;
    findById(id: string): Promise<BlogPost | null>;
    slugExists(slug: string, excludeId?: string): Promise<boolean>;
    create(data: CreateBlogInput): Promise<BlogPost>;
    update(id: string, data: UpdateBlogInput): Promise<BlogPost>;
    delete(id: string): Promise<void>;
}
