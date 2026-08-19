import GalleryManager from "@/components/admin/GalleryManager";
import { getGalleryForAdmin } from "@/lib/data/admin";

export default async function AdminGalleryPage() {
    const { gallery, kids } = await getGalleryForAdmin();

    return <GalleryManager initialGallery={gallery} initialKids={kids} />;
}