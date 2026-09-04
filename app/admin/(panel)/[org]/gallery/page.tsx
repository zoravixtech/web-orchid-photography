import MediaLibraryManager from "@/components/admin/MediaLibraryManager";
import { getGalleryForAdmin, listCategoriesForAdmin } from "@/lib/data/admin";
import type { Org } from "@/lib/types";

export default async function GalleryPage({
    params,
    searchParams,
}: {
    params: Promise<{ org: string }>;
    searchParams: Promise<{ category?: string }>;
}) {
    const { org } = await params;
    const { category } = await searchParams;
    const orgTyped = org as Org;

    const categories = await listCategoriesForAdmin(orgTyped);
    const activeCategoryId = category && categories.some((c) => c.id === category) ? category : categories[0]?.id;

    const { images, heroCarouselIds } = activeCategoryId
        ? await getGalleryForAdmin(orgTyped, activeCategoryId)
        : { images: [], heroCarouselIds: [] };

    return (
        <MediaLibraryManager
            org={orgTyped}
            categories={categories}
            activeCategoryId={activeCategoryId ?? null}
            initialImages={images}
            initialHeroCarouselIds={heroCarouselIds}
        />
    );
}
