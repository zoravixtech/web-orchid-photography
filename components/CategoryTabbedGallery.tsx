import Image from "next/image";
import Link from "next/link";
import type { Category, GalleryMediaItem } from "@/lib/types";

interface CategoryTabbedGalleryProps {
    categories: Category[];
    activeCategoryId: string | null;
    images: GalleryMediaItem[];
    basePath: string;
}

export default function CategoryTabbedGallery({ categories, activeCategoryId, images, basePath }: CategoryTabbedGalleryProps) {
    if (categories.length === 0) {
        return (
            <section className="py-16 sm:py-24 bg-white text-center text-slate-500">
                No galleries have been published yet.
            </section>
        );
    }

    return (
        <section className="py-16 sm:py-24 bg-white px-2 sm:px-3 md:px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`${basePath}?category=${category.id}`}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                                category.id === activeCategoryId
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>

                {images.length === 0 ? (
                    <p className="text-center text-slate-500">No images in this category yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {images.map((image) => (
                            <div key={image.id} className="relative aspect-4/3 overflow-hidden bg-slate-100">
                                <Image
                                    src={image.url}
                                    alt={image.alt || "Gallery image"}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 640px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
