"use client";

import React, { useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";

interface OfficeImage {
    id: string;
    url: string;
    title: string;
}

const OFFICE_IMAGES: OfficeImage[] = [
    {
        id: "1",
        url: "https://images.prismic.io/chobirkotha2/Zw4-DoF3NbkBXcPv_office1.jpeg?auto=format,compress&rect=2,0,4156,2628&w=1400",
        title: "Main Client Reception Lounge",
    },
    {
        id: "2",
        url: "https://images.prismic.io/chobirkotha2/Zw4-DoF3NbkBXcPu_office2.jpeg?auto=format,compress&rect=0,1,4160,2771&w=1400",
        title: "Creative Editing Suite & Workstation",
    },
    {
        id: "3",
        url: "https://images.prismic.io/chobirkotha2/Zw4-DYF3NbkBXcPs_office3.jpeg?auto=format,compress&rect=0,1,4160,2771&w=1400",
        title: "Photography Studio & Equipment Hub",
    },
    {
        id: "4",
        url: "https://images.prismic.io/chobirkotha2/Zw4-DIF3NbkBXcPq_office4.jpeg?auto=format,compress&rect=0,1,4160,2771&w=1400",
        title: "Client Consultation & Storyboarding Area",
    },
];

export default function AboutOfficeSection() {
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

    const handlePrev = () => {
        if (activeImageIndex === null) return;
        setActiveImageIndex((prev) =>
            prev === 0 ? OFFICE_IMAGES.length - 1 : (prev ?? 0) - 1
        );
    };

    const handleNext = () => {
        if (activeImageIndex === null) return;
        setActiveImageIndex((prev) =>
            prev === OFFICE_IMAGES.length - 1 ? 0 : (prev ?? 0) + 1
        );
    };

    return (
        <section className="py-16 sm:py-24 bg-white text-slate-800">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                
                {/* Section Header */}
                <SectionHeader
                    subtitle="OUR WORKSPACE"
                    italicTagline="Where Creativity & Memories Take Shape"
                    title="OUR OFFICE TOUR"
                    description="Take a look behind the scenes at our state-of-the-art photography studio and client lounge in Kolkata."
                />

                {/* Office Photos Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {OFFICE_IMAGES.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveImageIndex(index)}
                            className="group relative aspect-4/3 rounded-2xl overflow-hidden shadow-md cursor-pointer border border-slate-200/80 bg-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                        >
                            <Image
                                src={item.url}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-0.5">
                                    Studio Tour
                                </span>
                                <h4 className="font-serif text-sm font-semibold leading-snug">
                                    {item.title}
                                </h4>
                            </div>
                            
                            {/* Zoom Icon Badge */}
                            <div className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Lightbox Image Preview Modal */}
            {activeImageIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
                    {/* Close Button */}
                    <button
                        onClick={() => setActiveImageIndex(null)}
                        className="absolute top-5 right-5 z-50 p-2.5 rounded-full text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Left Prev Arrow */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 sm:left-8 z-50 p-3 rounded-full text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700 transition-all hover:scale-110"
                        aria-label="Previous image"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Image Container */}
                    <div className="relative max-w-5xl w-full max-h-[80vh] aspect-16/10 rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20">
                        <Image
                            src={OFFICE_IMAGES[activeImageIndex].url}
                            alt={OFFICE_IMAGES[activeImageIndex].title}
                            fill
                            className="object-contain bg-slate-950"
                            priority
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent text-center text-white">
                            <h3 className="font-serif text-lg font-bold">
                                {OFFICE_IMAGES[activeImageIndex].title}
                            </h3>
                            <span className="text-xs text-slate-400 mt-1 block">
                                Image {activeImageIndex + 1} of {OFFICE_IMAGES.length}
                            </span>
                        </div>
                    </div>

                    {/* Right Next Arrow */}
                    <button
                        onClick={handleNext}
                        className="absolute right-4 sm:right-8 z-50 p-3 rounded-full text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700 transition-all hover:scale-110"
                        aria-label="Next image"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </section>
    );
}
