import type { Payload } from "payload";
import type {
    CareerRepository,
    CreateCareerInput,
    UpdateCareerInput,
} from "@/lib/repositories/careerRepository";
import type { CareerPost } from "@/lib/types";

interface CareerDoc {
    id: string | number;
    title: string;
    description: string;
    link: string;
    createdAt: string;
}

function mapDoc(doc: CareerDoc): CareerPost {
    return {
        id: String(doc.id),
        title: doc.title,
        description: doc.description,
        link: doc.link,
        createdAt: doc.createdAt,
    };
}

export class PayloadCareerRepository implements CareerRepository {
    constructor(private payloadPromise: Promise<Payload>) {}

    async list(): Promise<CareerPost[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "careers",
            sort: "-createdAt",
            limit: 0,
        });
        return (docs as CareerDoc[]).map(mapDoc);
    }

    async findById(id: string): Promise<CareerPost | null> {
        const payload = await this.payloadPromise;
        try {
            const doc = (await payload.findByID({ collection: "careers", id })) as CareerDoc;
            return mapDoc(doc);
        } catch {
            return null;
        }
    }

    async create(input: CreateCareerInput): Promise<CareerPost> {
        const payload = await this.payloadPromise;
        const doc = (await payload.create({ collection: "careers", data: input })) as CareerDoc;
        return mapDoc(doc);
    }

    async update(id: string, input: UpdateCareerInput): Promise<CareerPost> {
        const payload = await this.payloadPromise;
        const doc = (await payload.update({ collection: "careers", id, data: input })) as CareerDoc;
        return mapDoc(doc);
    }

    async delete(id: string): Promise<void> {
        const payload = await this.payloadPromise;
        await payload.delete({ collection: "careers", id });
    }
}
