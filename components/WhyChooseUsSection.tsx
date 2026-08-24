import React from "react";
import SectionHeader from "@/components/SectionHeader";

function PunctualityIcon() {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none"
        >
            {/* Top Winder Ring & Ribbon */}
            <path d="M30 13 C26 8, 20 12, 24 18 C28 20, 34 16, 30 13 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.5" />
            <path d="M50 13 C54 8, 60 12, 56 18 C52 20, 46 16, 50 13 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="40" cy="14" r="6" fill="#FACC15" stroke="#1E293B" strokeWidth="2.5" />
            <rect x="37" y="18" width="6" height="5" rx="1" fill="#EA580C" stroke="#1E293B" strokeWidth="2" />

            {/* Outer Gold Pocket Watch Case */}
            <circle cx="40" cy="46" r="26" fill="#FACC15" stroke="#1E293B" strokeWidth="2.5" />
            
            {/* Inner Clock Face */}
            <circle cx="40" cy="46" r="20" fill="#E0F2FE" stroke="#1E293B" strokeWidth="2" />
            
            {/* Hour Markers */}
            <circle cx="40" cy="30" r="1.5" fill="#1E293B" />
            <circle cx="56" cy="46" r="1.5" fill="#1E293B" />
            <circle cx="40" cy="62" r="1.5" fill="#1E293B" />
            <circle cx="24" cy="46" r="1.5" fill="#1E293B" />
            
            {/* Clock Hands */}
            <path d="M40 46 L32 37" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
            <path d="M40 46 L51 38" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="40" cy="46" r="3" fill="#1E293B" />
        </svg>
    );
}

function CinematicIcon() {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none"
        >
            {/* Top Film Reels */}
            <circle cx="28" cy="24" r="12" fill="#FACC15" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="28" cy="24" r="4" fill="#1E293B" />
            <circle cx="48" cy="22" r="10" fill="#FB923C" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="48" cy="22" r="3.5" fill="#1E293B" />

            {/* Camera Body */}
            <rect x="16" y="34" width="40" height="28" rx="5" fill="#8B5CF6" stroke="#1E293B" strokeWidth="2.5" />
            <rect x="20" y="38" width="8" height="6" rx="1" fill="#C084FC" stroke="#1E293B" strokeWidth="1.5" />

            {/* Front Lens Cone */}
            <path d="M56 41 L72 32 L72 63 L56 55 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
            
            {/* Lens Reflection Highlights */}
            <path d="M62 39 L68 36" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" />
            <path d="M63 56 L69 58" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" />

            {/* Base Mount Stand */}
            <path d="M26 62 L22 72 M46 62 L50 72" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

function ExperienceIcon() {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none"
        >
            {/* Hanging Ribbon Sashes */}
            <path d="M30 46 L22 72 L32 66 L40 72 L36 48 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M50 46 L58 72 L48 66 L40 72 L44 48 Z" fill="#E11D48" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />

            {/* Outer Badge Rosette */}
            <circle cx="40" cy="34" r="22" fill="#8B5CF6" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="40" cy="34" r="17" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />

            {/* Center Star */}
            <path
                d="M40 22 L43.5 29 L51 30 L45.5 35.5 L47 43 L40 39 L33 43 L34.5 35.5 L29 30 L36.5 29 Z"
                fill="#FFFBEB"
                stroke="#1E293B"
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function StorytellersIcon() {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none"
        >
            {/* Book Cover Base */}
            <path d="M12 58 C24 53, 38 53, 40 57 C42 53, 56 53, 68 58 L68 62 C56 57, 42 57, 40 61 C38 57, 24 57, 12 62 Z" fill="#7E22CE" stroke="#1E293B" strokeWidth="2" />

            {/* Left Open Page */}
            <path d="M14 26 C26 22, 38 24, 40 28 L40 56 C38 52, 26 50, 14 54 Z" fill="#FFFBEB" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />

            {/* Right Open Page */}
            <path d="M66 26 C54 22, 42 24, 40 28 L40 56 C42 52, 54 50, 66 54 Z" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />

            {/* Photo frame popping out on left page */}
            <rect x="18" y="31" width="17" height="15" rx="2" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="23" cy="35" r="2" fill="#FACC15" />
            <path d="M20 44 L25 39 L31 44 Z" fill="#34D399" stroke="#1E293B" strokeWidth="1" />

            {/* Heart Motif on right page */}
            <path d="M52 35 C52 32, 55 30, 57.5 30 C60 30, 62 32, 62 34.5 C62 38, 57.5 41, 57.5 41 C57.5 41, 53 38, 53 34.5 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.5" />

            {/* Story Text lines */}
            <line x1="45" y1="44" x2="60" y2="44" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="45" y1="48" x2="56" y2="48" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function InvisibleIcon() {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none"
        >
            {/* Flash & Sparkle */}
            <path d="M34 16 L46 16 L43 24 L37 24 Z" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
            <path d="M62 14 L65 20 L71 21 L66 26 L68 32 L62 28 L56 32 L58 26 L53 21 L59 20 Z" fill="#EC4899" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />

            {/* Camera Body */}
            <rect x="12" y="24" width="56" height="40" rx="8" fill="#0D9488" stroke="#1E293B" strokeWidth="2.5" />
            <rect x="18" y="28" width="12" height="6" rx="2" fill="#2DD4BF" stroke="#1E293B" strokeWidth="1.5" />

            {/* Multi-ring Lens */}
            <circle cx="40" cy="44" r="16" fill="#1E293B" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="40" cy="44" r="12" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="40" cy="44" r="7" fill="#6366F1" stroke="#1E293B" strokeWidth="1" />
            <circle cx="36" cy="40" r="2.5" fill="#FFFFFF" />
        </svg>
    );
}

function PromiseIcon() {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none"
        >
            {/* Sparkles */}
            <path d="M16 20 L18 25 L23 27 L18 29 L16 34 L14 29 L9 27 L14 25 Z" fill="#FACC15" />
            <path d="M64 18 L65.5 22 L69.5 23.5 L65.5 25 L64 29 L62.5 25 L58.5 23.5 L62.5 22 Z" fill="#38BDF8" />

            {/* Shackle handle */}
            <path d="M30 36 L30 25 C30 18, 50 18, 50 25 L50 36" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Golden Heart Lock Body */}
            <path
                d="M40 70 C22 56, 14 44, 14 36 C14 28, 22 24, 30 27 C35 29, 38 33, 40 35 C42 33, 45 29, 50 27 C58 24, 66 28, 66 36 C66 44, 58 56, 40 70 Z"
                fill="#FACC15"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />

            {/* Ribbon Bows */}
            <path d="M26 38 C20 34, 18 42, 26 42 Z" fill="#F472B6" stroke="#1E293B" strokeWidth="1.5" />
            <path d="M54 38 C60 34, 62 42, 54 42 Z" fill="#F472B6" stroke="#1E293B" strokeWidth="1.5" />

            {/* Keyhole */}
            <circle cx="40" cy="44" r="3.5" fill="#1E293B" />
            <path d="M38.5 44 L41.5 44 L42.5 53 L37.5 53 Z" fill="#1E293B" />
        </svg>
    );
}

interface FeatureCard {
    id: string;
    icon: React.ComponentType;
    title: string;
    description: string;
}

const features: FeatureCard[] = [
    {
        id: "punctuality",
        icon: PunctualityIcon,
        title: "Unwavering Punctuality",
        description: "We deeply respect the sanctity of sacred mahurats. Our dedicated team arrives well in advance, seamlessly tracking your event timeline so every ritual, smile, and auspicious moment is captured without delay.",
    },
    {
        id: "cinematic",
        icon: CinematicIcon,
        title: "Cinematic Excellence",
        description: "Equipped with ultra-HD 4K cinema gear, aerial drones, and specialized lenses, our visual storytellers craft a mesmerizing film complete with custom color grading, crisp sound design, and Hollywood-like drama.",
    },
    {
        id: "experience",
        icon: ExperienceIcon,
        title: "Years Of Experience",
        description: "With over 15 years of excellence in candid marriage photography across Kolkata and India, our seasoned masters effortlessly handle dynamic lighting, crowded venues, and high-energy celebrations.",
    },
    {
        id: "storytellers",
        icon: StorytellersIcon,
        title: "Master Storytellers (Candid & Traditional)",
        description: "We artfully blend spontaneous candid photojournalism with majestic traditional portraiture. From raw unscripted tears of joy to grand family rituals, we immortalize your love story in all its richness.",
    },
    {
        id: "invisible",
        icon: InvisibleIcon,
        title: "The \"Invisible\" Approach",
        description: "Our photographers blend discreetly into your celebrations. You stay fully present with your loved ones while we quietly capture authentic, unposed emotions without intrusive staging or interruptions.",
    },
    {
        id: "promise",
        icon: PromiseIcon,
        title: "Our Promise",
        description: "We don't just deliver photographs; we handcraft heirloom photo albums and timeless cinema cuts. Our commitment is to give you a priceless keepsake that lets you relive your fondest memories forever.",
    },
];

export default function WhyChooseUsSection() {
    return (
        <section id="about" className="bg-white py-24 px-6 border-y border-purple-100/60">
            <div className="max-w-6xl mx-auto">
                {/* Standardized Section Header */}
                <SectionHeader
                    italicTagline="When Love Meets The Artistry Of Our Lens!"
                    title="Why We Are Rated Among the Top Wedding Photographers in Kolkata"
                />

                {/* 6 Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={item.id}
                                className="bg-white p-8 sm:p-9 rounded-2xl shadow-xs text-center border border-purple-100/80 flex flex-col items-center transition-all duration-300 hover:shadow-md hover:border-purple-200"
                            >
                                {/* Icon Container with purple accent lines */}
                                <div className="flex items-center gap-2.5 mb-5">
                                    <div className="h-px w-5 bg-purple-300" />
                                    <div className="p-2 sm:p-2.5 rounded-2xl bg-purple-50/80 border border-purple-100/60 shadow-2xs flex items-center justify-center">
                                        <IconComponent />
                                    </div>
                                    <div className="h-px w-5 bg-purple-300" />
                                </div>

                                {/* Card Title */}
                                <h3 className="font-serif text-lg font-normal text-slate-800 mb-3 leading-snug">
                                    {item.title}
                                </h3>

                                {/* Card Description */}
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
