import GalleryManager from "@/components/admin/GalleryManager";
import { getGalleryForAdmin } from "@/lib/data/admin";

export default async function AdminGalleryPage() {
    const { images, heroCarouselIds } = await getGalleryForAdmin("gallery");

    return (
        <GalleryManager section="gallery" initialImages={images} initialHeroCarouselIds={heroCarouselIds} />
    );
}
