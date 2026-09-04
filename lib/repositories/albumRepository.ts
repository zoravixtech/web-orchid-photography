import type { Album, Org } from "@/lib/types";

export interface CreateAlbumInput {
    org: Org;
    name: string;
    coverImage: string;
    coverPosition?: string;
    address?: string;
    venue?: string;
    category?: string;
}

export interface UpdateAlbumInput {
    name?: string;
    coverImage?: string;
    coverPosition?: string;
    address?: string;
    venue?: string;
    category?: string;
}

export interface AddAlbumImageInput {
    url: string;
    storagePath: string | null;
    alt: string;
}

export interface AlbumRepository {
    list(org: Org): Promise<Album[]>;
    getById(id: string): Promise<Album | null>;
    getBySlug(org: Org, slug: string): Promise<Album | null>;
    create(input: CreateAlbumInput): Promise<Album>;
    update(id: string, input: UpdateAlbumInput): Promise<Album>;
    delete(id: string): Promise<void>;
    addImages(id: string, images: AddAlbumImageInput[]): Promise<Album>;
    removeImage(id: string, imageId: string): Promise<Album>;
}
