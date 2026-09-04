import { notFound } from "next/navigation";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import { getAlbumBySlug } from "@/lib/data/albums";

export const revalidate = 86400;

export default async function KidographyAlbumDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const album = await getAlbumBySlug("kidography", slug);
    if (!album) notFound();

    return (
        <div className="min-h-screen bg-white">
            <PageBanner
                eyebrow="The Orchid Kidography"
                title={album.name}
                description={`${album.images.length} photo${album.images.length === 1 ? "" : "s"}`}
                imageSrc={album.coverImage}
                imageAlt={album.name}
            />

            <section className="py-16 sm:py-24 bg-white px-2 sm:px-3 md:px-4">
                <div className="max-w-6xl mx-auto">
                    {album.images.length === 0 ? (
                        <p className="text-center text-slate-500">No images in this album yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {album.images.map((image) => (
                                <div key={image.id} className="relative aspect-4/3 overflow-hidden bg-slate-100">
                                    <Image
                                        src={image.url}
                                        alt={image.alt || album.name}
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
        </div>
    );
}
