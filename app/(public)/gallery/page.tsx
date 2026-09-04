import PageBanner from "@/components/PageBanner";
import CategoryTabbedGallery from "@/components/CategoryTabbedGallery";
import { getCategories } from "@/lib/data/categories";
import { getGalleryMedia } from "@/lib/data/settings";

export const revalidate = 86400;

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const { category } = await searchParams;
    const categories = await getCategories("orchid");
    const activeCategoryId = category && categories.some((c) => c.id === category) ? category : categories[0]?.id;
    const images = activeCategoryId ? await getGalleryMedia("orchid", activeCategoryId) : [];

    return (
        <div className="min-h-screen bg-white">
            <PageBanner
                eyebrow="The Orchid Photography"
                title={
                    <>
                        Full <span className="italic font-normal text-purple-400">Gallery</span>
                    </>
                }
                imageAlt="The Orchid Photography Gallery Header"
            />

            <CategoryTabbedGallery
                categories={categories}
                activeCategoryId={activeCategoryId ?? null}
                images={images}
                basePath="/gallery"
            />
        </div>
    );
}
