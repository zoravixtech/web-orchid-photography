import type { Payload } from "payload";
import type {
    CreateFilmInput,
    FilmRepository,
    UpdateFilmInput,
} from "@/lib/repositories/filmRepository";
import type { Film } from "@/lib/types";

interface FilmDoc {
    id: string | number;
    title: string;
    youtubeUrl: string;
    videoId: string;
    thumbnailUrl: string;
    createdAt: string;
}

function mapDoc(doc: FilmDoc): Film {
    return {
        id: String(doc.id),
        title: doc.title,
        youtubeUrl: doc.youtubeUrl,
        videoId: doc.videoId,
        thumbnailUrl: doc.thumbnailUrl,
        createdAt: doc.createdAt,
    };
}

export class PayloadFilmRepository implements FilmRepository {
    constructor(private payloadPromise: Promise<Payload>) {}

    async list(): Promise<Film[]> {
        const payload = await this.payloadPromise;
        const { docs } = await payload.find({
            collection: "films",
            sort: "-createdAt",
            limit: 0,
        });
        return (docs as unknown as FilmDoc[]).map(mapDoc);
    }

    async findById(id: string): Promise<Film | null> {
        const payload = await this.payloadPromise;
        try {
            const doc = (await payload.findByID({ collection: "films", id: Number(id) || id })) as unknown as FilmDoc;
            return mapDoc(doc);
        } catch {
            return null;
        }
    }

    async create(input: CreateFilmInput): Promise<Film> {
        const payload = await this.payloadPromise;
        const doc = (await payload.create({
            collection: "films",
            data: {
                title: input.title,
                youtubeUrl: input.youtubeUrl,
                videoId: input.videoId,
                thumbnailUrl: input.thumbnailUrl,
            },
        })) as unknown as FilmDoc;
        return mapDoc(doc);
    }

    async update(id: string, input: UpdateFilmInput): Promise<Film> {
        const payload = await this.payloadPromise;
        const updateData: Record<string, unknown> = {};
        if (input.title !== undefined) updateData.title = input.title;
        if (input.youtubeUrl !== undefined) updateData.youtubeUrl = input.youtubeUrl;
        if (input.videoId !== undefined) updateData.videoId = input.videoId;
        if (input.thumbnailUrl !== undefined) updateData.thumbnailUrl = input.thumbnailUrl;

        const doc = (await payload.update({
            collection: "films",
            id: Number(id) || id,
            data: updateData,
        })) as unknown as FilmDoc;
        return mapDoc(doc);
    }

    async delete(id: string): Promise<void> {
        const payload = await this.payloadPromise;
        await payload.delete({
            collection: "films",
            id: Number(id) || id,
        });
    }
}
