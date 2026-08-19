import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import type { GalleryMediaItem } from "@/lib/types";

interface ServiceItem {
    id: string;
    title: string;
    category: string;
}

const servicesData: ServiceItem[] = [
    { id: "bengali-wedding", title: "Bengali Wedding Photography", category: "KOLKATA / BENGALI WEDDING" },
    { id: "pre-wedding", title: "Pre Wedding Photography", category: "SIKKIM / DESTINATION PREWEDDING" },
    { id: "maternity-baby", title: "Maternity & Baby Photography", category: "KOLKATA / BABY & MATERNITY" },
    { id: "candid-wedding", title: "Candid Wedding Photography", category: "KOLKATA / CANDID WEDDING" },
    { id: "sikh-wedding", title: "Sikh Wedding Photography", category: "PUNJAB / SIKH WEDDING" },
    { id: "christian-wedding", title: "Christian Wedding Photography", category: "GOA / CHRISTIAN WEDDING" },
    { id: "patna-wedding", title: "Patna Wedding Photography", category: "PATNA / WEDDING" },
    { id: "rice-ceremony", title: "Rice Ceremony Photography", category: "KOLKATA / RICE CEREMONY" },
    { id: "siliguri-wedding", title: "Siliguri Wedding Photography", category: "SILIGURI / WEDDING" },
    { id: "marwadi-wedding", title: "Marwadi Wedding Photography", category: "KOLKATA / BIG FAT MARWARI WEDDING" },
    { id: "bhubaneswar-wedding", title: "Bhubaneswar Wedding Photography", category: "BHUBANESWAR / WEDDING" },
    { id: "corporate", title: "Kolkata Corporate Photography", category: "KOLKATA / CORPORATE" },
];

export default function ServicesSection({ images }: { images: GalleryMediaItem[] }) {
    return (
        <section id="services" className="bg-white py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Standardized Section Header */}
                <SectionHeader
                    subtitle="Our Specializations"
                    title="Orchid Photography"
                    description="Award Winning Best Wedding Photographer in Kolkata, operating all over India"
                />

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                    {servicesData.map((item, index) => {
                        const image = images.length > 0 ? images[index % images.length] : null;
                        return (
                            <div key={item.id} className="group cursor-pointer">
                                {/* Sharp edge square image container (rounded-none) */}
                                <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100 rounded-none">
                                    {image ? (
                                        <Image
                                            src={image.url}
                                            alt={item.title}
                                            fill
                                            className="object-cover object-center rounded-none transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-linear-to-br from-zinc-200 to-zinc-100" />
                                    )}
                                </div>

                                {/* Title & Subtitle centered below image with font-serif uppercase */}
                                <div className="mt-4 text-center">
                                    <h3 className="font-serif text-base sm:text-lg font-normal tracking-wide uppercase text-zinc-900 group-hover:text-purple-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mt-1">
                                        {item.category}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
