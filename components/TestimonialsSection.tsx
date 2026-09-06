"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { ReviewCard } from "@/components/ReviewCard";
import { PlatformLogo } from "@/components/PlatformLogo";
import type { Review } from "@/lib/types";

interface TestimonialsSectionProps {
    pinnedReviews?: Review[];
}

export default function TestimonialsSection({ pinnedReviews }: TestimonialsSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldMarquee, setShouldMarquee] = useState(false);

    // Measure container width and determine if all reviews fit in focus at once
    useEffect(() => {
        if (!containerRef.current || !pinnedReviews || pinnedReviews.length === 0) return;

        const checkOverflow = () => {
            if (!containerRef.current || !pinnedReviews) return;
            const containerWidth = containerRef.current.clientWidth;
            const isSm = window.innerWidth >= 640;
            const cardWidth = isSm ? 384 : 320; // w-96 (384px) on sm, w-80 (320px) on mobile
            const gap = 24; // gap-6 (24px)
            const totalWidth =
                pinnedReviews.length * cardWidth +
                Math.max(0, pinnedReviews.length - 1) * gap;

            setShouldMarquee(totalWidth > containerWidth);
        };

        checkOverflow();

        const observer = new ResizeObserver(() => {
            checkOverflow();
        });
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [pinnedReviews]);

    // If no pinned reviews exist, do not render the section at all
    if (!pinnedReviews || pinnedReviews.length === 0) {
        return null;
    }

    // Build seamless marquee loop using ONLY the user's real pinned reviews
    let items = [...pinnedReviews];
    while (items.length < 6) {
        items = [...items, ...pinnedReviews];
    }
    const marqueeItems = [...items, ...items];

    // Compute average star rating from real pinned reviews
    const avgRating = (
        pinnedReviews.reduce((sum, r) => sum + r.stars, 0) / pinnedReviews.length
    ).toFixed(1);

    return (
        <section id="testimonials" className="bg-white py-24 px-4 sm:px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto text-center">
                <SectionHeader
                    subtitle="OUR TESTIMONIALS"
                    title="Cheers From Our Clients"
                />

                {/* Rating Badges Header */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 bg-purple-50/60 border border-purple-100 rounded-2xl p-4 sm:px-8 sm:py-3.5 max-w-2xl mx-auto mt-6 shadow-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-base sm:text-lg">{avgRating}</span>
                        <div className="flex text-amber-400 text-sm tracking-wider">★★★★★</div>
                        <span className="text-xs text-slate-500 font-medium">Client Rating</span>
                    </div>

                    <div className="h-4 w-px bg-purple-200 hidden sm:block" />

                    <div className="flex items-center gap-3">
                        <PlatformLogo platform="google" className="w-5 h-5" />
                        <PlatformLogo platform="facebook" className="w-5 h-5" />
                        <PlatformLogo platform="wedmegood" className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Container for Reviews (Static when in focus, Marquee when overflowing) */}
            <div ref={containerRef} className="relative mt-12 w-full overflow-hidden">
                {shouldMarquee ? (
                    /* Continuous Marquee Carousel (when reviews overflow screen width) */
                    <>
                        {/* Gradient fade edges for smooth transition */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                        <div className="animate-marquee flex gap-6 px-4 py-3">
                            {marqueeItems.map((review, idx) => (
                                <div
                                    key={`${review.id}-${idx}`}
                                    className="w-80 sm:w-96 shrink-0 flex flex-col"
                                >
                                    <ReviewCard review={review} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Static Stiff Layout (when all reviews fit completely on screen) */
                    <div className="flex flex-wrap items-stretch justify-center gap-6 px-4 py-3 max-w-7xl mx-auto">
                        {pinnedReviews.map((review) => (
                            <div key={review.id} className="w-80 sm:w-96 flex flex-col">
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Link to Full Reviews Page */}
            <div className="mt-10 text-center">
                <Link
                    href="/reviews"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 transition-all shadow-md shadow-purple-500/20"
                >
                    <span>View All Reviews</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
