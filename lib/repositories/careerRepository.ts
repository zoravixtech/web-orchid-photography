import type { CareerPost } from "@/lib/types";

export interface CreateCareerInput {
    title: string;
    description: string;
    link: string;
}

export type UpdateCareerInput = Partial<CreateCareerInput>;

export interface CareerRepository {
    list(): Promise<CareerPost[]>;
    findById(id: string): Promise<CareerPost | null>;
    create(input: CreateCareerInput): Promise<CareerPost>;
    update(id: string, input: UpdateCareerInput): Promise<CareerPost>;
    delete(id: string): Promise<void>;
}
