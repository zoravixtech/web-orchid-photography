import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import type { GalleryMediaItem } from "@/lib/types";

export interface ServiceItem {
    id: string;
    title: string;
    category: string;
}

export const weddingServicesData: ServiceItem[] = [
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

export const kidsServicesData: ServiceItem[] = [
    { id: "newborn", title: "Newborn Photography", category: "KOLKATA / NEWBORN SHOOT" },
    { id: "cake-smash", title: "Cake Smash Photography", category: "KOLKATA / CAKE SMASH" },
    { id: "birthday", title: "Kids Birthday Photography", category: "KOLKATA / BIRTHDAY CELEBRATION" },
    { id: "toddler", title: "Toddler Photography", category: "KOLKATA / TODDLER PORTRAITS" },
    { id: "annaprasan", title: "Annaprasan Ceremony Photography", category: "KOLKATA / RICE CEREMONY" },
    { id: "family-kids", title: "Family & Kids Photography", category: "KOLKATA / FAMILY WITH KIDS" },
    { id: "sibling", title: "Sibling Photography", category: "KOLKATA / SIBLING PORTRAITS" },
    { id: "kids-fashion", title: "Kids Fashion Photography", category: "SILIGURI / KIDS FASHION" },
    { id: "school-event", title: "School Event Photography", category: "KOLKATA / SCHOOL EVENTS" },
    { id: "maternity-journey", title: "Maternity To Baby Journey", category: "BHUBANESWAR / MATERNITY & BABY" },
    { id: "candid-kids", title: "Candid Kids Photography", category: "PATNA / CANDID KIDS" },
    { id: "kids-portrait", title: "Kids Portrait Photography", category: "KOLKATA / KIDS PORTRAIT" },
];

interface ServicesSectionProps {
    images: GalleryMediaItem[];
    services?: ServiceItem[];
    subtitle?: string;
    title?: string;
    description?: string;
}

export default function ServicesSection({
    images,
    services = weddingServicesData,
    subtitle = "Our Specializations",
    title = "The Orchid Photography",
    description = "Award Winning Best Wedding Photographer in Kolkata, operating all over India",
}: ServicesSectionProps) {
    return (
        <section id="services" className="bg-white py-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Standardized Section Header */}
                <SectionHeader subtitle={subtitle} title={title} description={description} />

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                    {services.map((item, index) => {
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
