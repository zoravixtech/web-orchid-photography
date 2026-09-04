import PageBanner from "@/components/PageBanner";
import CategoryTabbedGallery from "@/components/CategoryTabbedGallery";
import { getCategories } from "@/lib/data/categories";
import { getGalleryMedia } from "@/lib/data/settings";

export const revalidate = 86400;

export default async function KidographyGalleryPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const { category } = await searchParams;
    const categories = await getCategories("kidography");
    const activeCategoryId = category && categories.some((c) => c.id === category) ? category : "all";
    const images =
        categories.length === 0
            ? []
            : activeCategoryId === "all"
            ? await getGalleryMedia("kidography")
            : await getGalleryMedia("kidography", activeCategoryId);

    return (
        <div className="min-h-screen bg-white">
            <PageBanner
                eyebrow="The Orchid Kidography"
                title={
                    <>
                        Full <span className="italic font-normal text-purple-400">Gallery</span>
                    </>
                }
                imageAlt="The Orchid Kidography Gallery Header"
            />

            <CategoryTabbedGallery
                categories={categories}
                activeCategoryId={activeCategoryId}
                images={images}
                basePath="/kidography/gallery"
            />
        </div>
    );
}
