import GalleryManager from "@/components/admin/GalleryManager";
import { getGalleryForAdmin } from "@/lib/data/admin";

export default async function AdminKidsGalleryPage() {
    const { images, heroCarouselIds } = await getGalleryForAdmin("kids");

    return (
        <GalleryManager section="kids" initialImages={images} initialHeroCarouselIds={heroCarouselIds} />
    );
}
