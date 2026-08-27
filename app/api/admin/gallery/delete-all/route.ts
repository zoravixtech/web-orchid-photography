import { NextResponse } from "next/server";
import { deleteAllGalleryMedia } from "@/app/admin/actions/gallery";
import type { GallerySection } from "@/lib/types";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const section = body.section as GallerySection;

        if (section !== "gallery" && section !== "kids") {
            return NextResponse.json(
                { error: "Invalid section provided. Must be 'gallery' or 'kids'." },
                { status: 400 }
            );
        }

        const result = await deleteAllGalleryMedia(section);
        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    } catch (e: any) {
        return NextResponse.json(
            { error: e.message || "An unexpected error occurred." },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    return POST(request);
}
