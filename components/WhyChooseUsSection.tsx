import React from "react";
import SectionHeader from "@/components/SectionHeader";

interface FeatureCard {
    id: string;
    iconSvg: React.ReactNode;
    title: string;
    description: string;
}

const features: FeatureCard[] = [
    {
        id: "punctuality",
        iconSvg: (
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: "Unwavering Punctuality",
        description: "We respect the mahurat. We are always on time, ensuring not a single ritual is missed.",
    },
    {
        id: "cinematic",
        iconSvg: (
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        title: "Cinematic Excellence",
        description: "Our cinematography team uses high-end equipment to turn your wedding film into a movie-like experience.",
    },
    {
        id: "experience",
        iconSvg: (
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
        title: "Years Of Experience",
        description: "With more than 15 years of experience in candid marriage photography in Kolkata, traditional photography, and cinematic films of weddings, we bring a level of expertise that is unmatched to make your wedding picture-perfect.",
    },
    {
        id: "storytellers",
        iconSvg: (
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        title: "Master Storytellers (Candid & Traditional)",
        description: "We blend the spontaneity of candid wedding photography with the grandeur of traditional poses. We capture the unscripted laughter and the solemn rituals with equal finesse.",
    },
    {
        id: "invisible",
        iconSvg: (
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: "The \"Invisible\" Approach",
        description: "We document your day without intruding on it. You enjoy the moment; we capture the magic.",
    },
    {
        id: "promise",
        iconSvg: (
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
        ),
        title: "Our Promise",
        description: "We don't just deliver photos; we deliver a return ticket to your favorite moments.",
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
                    {features.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-8 sm:p-9 rounded-2xl shadow-xs text-center border border-purple-100/80 flex flex-col items-center transition-all duration-300 hover:shadow-md hover:border-purple-200"
                        >
                            {/* Icon Container with purple accent lines */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-px w-4 bg-purple-300" />
                                <div className="p-2.5 rounded-full bg-purple-50">
                                    {item.iconSvg}
                                </div>
                                <div className="h-px w-4 bg-purple-300" />
                            </div>

                            {/* Card Title */}
                            <h3 className="font-serif text-lg font-normal text-slate-800 mb-3 leading-snug">
                                {item.title}
                            </h3>

                            {/* Card Description */}
                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
