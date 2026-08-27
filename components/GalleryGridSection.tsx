"use client";

import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import type { GalleryMediaItem } from "@/lib/types";

interface GalleryGridSectionProps {
    images: GalleryMediaItem[];
    title?: string;
    subtitle?: string;
}

function DynamicGalleryCard({ item }: { item: GalleryMediaItem }) {
    return (
        <div className="relative w-full overflow-hidden group bg-slate-100 rounded-none aspect-4/3">
            <Image
                src={item.url}
                alt={item.alt || "Gallery Image"}
                fill
                loading="lazy"
                decoding="async"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center rounded-none transition-transform duration-500 group-hover:scale-105"
            />
        </div>
    );
}

export default function GalleryGridSection({
    images,
    title = "A Glimpse of Love and Laughter",
    subtitle = "Our Gallery",
}: GalleryGridSectionProps) {
    // Distribute incoming array of images in exact array index order across 3 columns:
    const columnCount = 3;
    const columns: GalleryMediaItem[][] = Array.from({ length: columnCount }, () => []);

    images.forEach((item, index) => {
        columns[index % columnCount].push(item);
    });

    return (
        <section id="gallery" className="bg-white py-20 px-2 sm:px-3 md:px-4 w-full">
            <div className="w-full mx-auto">
                {/* Standardized Section Header */}
                <SectionHeader subtitle={subtitle} title={title} />

                {/* 3-Column Interleaved Array Layout preserving incoming array order */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                    {columns.map((colItems, colIdx) => (
                        <div key={colIdx} className="flex flex-col gap-2">
                            {colItems.map((item) => (
                                <DynamicGalleryCard key={item.id} item={item} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}