import type { Payload } from "payload";
import type {
    CategoryRepository,
    CreateCategoryInput,
    UpdateCategoryInput,
} from "@/lib/repositories/categoryRepository";
import type { Category, Org } from "@/lib/types";

interface CategoryDoc {
    id: string | number;
    org: string;
    name: string;
}

function mapDoc(doc: CategoryDoc): Category {
    return { id: String(doc.id), org: doc.org as Org, name: doc.name };
}

export class PayloadCategoryRepository implements CategoryRepository {
    constructor(private payloadPromise: Promise<Payload>) {}

    async list(org: Org): Promise<Category[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "categories",
            where: { org: { equals: org } },
            sort: "name",
            limit: 0,
        });
        return (docs as CategoryDoc[]).map(mapDoc);
    }

    async findById(id: string): Promise<Category | null> {
        const payload = await this.payloadPromise;
        try {
            const doc = (await payload.findByID({ collection: "categories", id })) as CategoryDoc;
            return mapDoc(doc);
        } catch {
            return null;
        }
    }

    async create(input: CreateCategoryInput): Promise<Category> {
        const payload = await this.payloadPromise;
        const doc = (await payload.create({
            collection: "categories",
            data: { org: input.org, name: input.name },
        })) as CategoryDoc;
        return mapDoc(doc);
    }

    async update(id: string, input: UpdateCategoryInput): Promise<Category> {
        const payload = await this.payloadPromise;
        const doc = (await payload.update({
            collection: "categories",
            id,
            data: { ...(input.name !== undefined ? { name: input.name } : {}) },
        })) as CategoryDoc;
        return mapDoc(doc);
    }

    async delete(id: string): Promise<void> {
        const payload = await this.payloadPromise;
        await payload.delete({ collection: "categories", id });
    }
}
