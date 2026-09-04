import Image from "next/image";
import type { Album } from "@/lib/types";

interface AlbumHeroProps {
    album: Album;
}

function VenueIcon() {
    return (
        <svg className="w-[15px] h-[15px] shrink-0 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 3a1 1 0 00-1 1v17a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H4zm2 3h4v4H6V6zm6 0h4v4h-4V6zM6 12h4v4H6v-4zm6 0h4v4h-4v-4zM6 18h12v2H6v-2z" />
        </svg>
    );
}

function AddressIcon() {
    return (
        <svg className="w-[15px] h-[15px] shrink-0 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
        </svg>
    );
}

function CategoryIcon() {
    return (
        <svg className="w-[15px] h-[15px] shrink-0 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
        </svg>
    );
}

export default function AlbumHero({ album }: AlbumHeroProps) {
    const tags = [
        { icon: <VenueIcon />, label: album.venue },
        { icon: <AddressIcon />, label: album.address },
        { icon: <CategoryIcon />, label: album.category },
    ].filter((tag): tag is { icon: React.ReactElement; label: string } => Boolean(tag.label));

    return (
        <div className="bg-white">
            <div className="relative w-full h-[52vh] sm:h-[64vh] lg:h-[80vh] mt-24 lg:mt-28 bg-slate-950">
                <Image
                    src={album.coverImage}
                    alt={album.name}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                    style={{ objectPosition: album.coverPosition || "50% 50%" }}
                />
            </div>

            <div className="bg-indigo-50/70 py-12 sm:py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h1
                        style={{ fontFamily: "var(--font-album-title)" }}
                        className="text-4xl sm:text-5xl md:text-6xl font-normal text-indigo-900"
                    >
                        {album.name}
                    </h1>

                    {tags.length > 0 && (
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-2 text-[13px] font-bold tracking-wide uppercase text-zinc-700"
                                >
                                    {tag.icon}
                                    {tag.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
