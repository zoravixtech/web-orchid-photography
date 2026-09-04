import type { Category, Org } from "@/lib/types";

export interface CreateCategoryInput {
    org: Org;
    name: string;
}

export interface UpdateCategoryInput {
    name?: string;
}

export interface CategoryRepository {
    list(org: Org): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    create(input: CreateCategoryInput): Promise<Category>;
    update(id: string, input: UpdateCategoryInput): Promise<Category>;
    delete(id: string): Promise<void>;
}
