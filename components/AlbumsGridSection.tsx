import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import type { Album } from "@/lib/types";

interface AlbumsGridSectionProps {
    albums: Album[];
    albumHrefBase?: string;
    subtitle?: string;
    title?: string;
    description?: string;
}

export default function AlbumsGridSection({
    albums,
    albumHrefBase = "/albums",
    subtitle = "Our Specializations",
    title = "The Orchid Photography",
    description = "Award Winning Best Wedding Photographer in Kolkata, operating all over India",
}: AlbumsGridSectionProps) {
    if (albums.length === 0) return null;

    return (
        <section id="services" className="bg-white py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <SectionHeader subtitle={subtitle} title={title} description={description} />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                    {albums.map((album) => (
                        <Link key={album.id} href={`${albumHrefBase}/${album.slug}`} className="group cursor-pointer block">
                            <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100 rounded-none">
                                <Image
                                    src={album.coverImage}
                                    alt={album.name}
                                    fill
                                    className="object-cover object-center rounded-none transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>

                            <div className="mt-4 text-center">
                                <h3 className="font-serif text-base sm:text-lg font-normal tracking-wide uppercase text-zinc-900 group-hover:text-purple-600 transition-colors">
                                    {album.name}
                                </h3>
                                <p className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mt-1">
                                    {album.images.length} photo{album.images.length === 1 ? "" : "s"}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
