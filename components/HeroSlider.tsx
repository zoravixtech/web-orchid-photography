"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { GalleryMediaItem } from "@/lib/types";

interface HeroSliderProps {
    images: GalleryMediaItem[];
}

export default function HeroSlider({ images }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000); // Automatically changes background every 4 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
            {images.length === 0 ? (
                // No gallery images uploaded yet: plain gradient instead of a broken image.
                <div className="absolute inset-0 h-full w-full bg-linear-to-br from-zinc-900 via-purple-950 to-zinc-900" />
            ) : (
                images.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        <Image
                            src={slide.url}
                            alt={slide.alt || `Hero Slide ${index + 1}`}
                            fill
                            priority={index === 0}
                            className="object-cover object-center"
                            sizes="100vw"
                        />
                    </div>
                ))
            )}

            {/* Soft dreamy vignette/mist overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-white/40 z-20 pointer-events-none" />

            {/* Moving Cloud Layer + Centered Tagline at Bottom */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden z-30 pointer-events-none h-48 sm:h-64 md:h-80 flex flex-col justify-end items-center pb-6">
                {/* Moving Cloud Image */}
                <div className="absolute inset-0 flex w-[200%] h-full animate-cloud-left-to-right opacity-95">
                    <div className="relative w-1/2 h-full shrink-0">
                        <Image
                            src="/cloud.avif"
                            alt="Cloud Layer"
                            fill
                            className="object-cover object-bottom"
                        />
                    </div>
                    <div className="relative w-1/2 h-full shrink-0">
                        <Image
                            src="/cloud.avif"
                            alt="Cloud Layer Duplicate"
                            fill
                            className="object-cover object-bottom"
                        />
                    </div>
                </div>

                {/* Soft gradient fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white via-white/80 to-transparent pointer-events-none" />
            </div>
        </section>
    );
}
