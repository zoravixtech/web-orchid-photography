import GalleryGridSection from "@/components/GalleryGridSection";
import { getGalleryMedia } from "@/lib/data/settings";

// Serve cached HTML for a long time; content is invalidated on-demand from the admin panel.
export const revalidate = 86400;

export default async function KidographyPage() {
    const kidsGalleryImages = await getGalleryMedia("kids");

    return (
        <div className="pt-24 pb-12">
            <GalleryGridSection
                subtitle="Specialized Kidography"
                title="Capturing Pure Smiles & Timeless Memories"
                images={kidsGalleryImages}
            />
        </div>
    );
}