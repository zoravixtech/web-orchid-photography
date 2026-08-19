"use client";

import { useState, useRef, useEffect } from "react";
import SectionHeader from "@/components/SectionHeader";

interface Testimonial {
    id: string;
    name: string;
    avatarColor: string;
    initials: string;
    rating: number;
    text: string;
}

const fallbackTestimonialsData: Testimonial[] = [
    {
        id: "review-1",
        name: "Megha Jha",
        avatarColor: "bg-purple-600",
        initials: "M",
        rating: 5,
        text: "Very good services provided by team at both end and picture quality is also too good. Thanku So much Orchid Photography Team, keep doing.",
    },
    {
        id: "review-2",
        name: "Jyoti Kumari",
        avatarColor: "bg-indigo-600",
        initials: "J",
        rating: 5,
        text: "Photography A+ Coordination A+ Every single click is just beyond words !! They have captured every single moment !! My wedding was on 14 March venue maithon..and pics do speak how much hard work they gave !!!",
    },
    {
        id: "review-3",
        name: "gudia kumari",
        avatarColor: "bg-purple-700",
        initials: "g",
        rating: 5,
        text: "Wonderful full team of Orchid Photography 🙏 there team's are very active & supporting..no doubt to booked them.. thank you 🙏 so much Orchid Photography for very lovely video's photo 🙏😊",
    },
    {
        id: "review-4",
        name: "Priyanka Roy",
        avatarColor: "bg-rose-600",
        initials: "P",
        rating: 5,
        text: "The best photography team in Kolkata! They captured all our traditional Bengali rituals so beautifully and patiently. Highly recommended!",
    },
    {
        id: "review-5",
        name: "Ankit Sharma",
        avatarColor: "bg-purple-600",
        initials: "A",
        rating: 5,
        text: "Superb quality and cinematography. Their team is extremely professional and polite. Our wedding film looks straight out of a movie.",
    },
    {
        id: "review-6",
        name: "Saurav Chatterjee",
        avatarColor: "bg-violet-600",
        initials: "S",
        rating: 5,
        text: "Extremely creative team. They turned our pre-wedding shoot into a breathtaking visual memory. Everyone loved our photo album!",
    },
];

const GoogleGIcon = () => (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
        />
        <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
        />
        <path
            fill="#FBBC05"
            d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
        />
        <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
        />
    </svg>
);

export default function TestimonialsSection() {
    const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>(fallbackTestimonialsData);
    const [googleRating, setGoogleRating] = useState(4.9);
    const [totalCount, setTotalCount] = useState(120);

    useEffect(() => {
        fetch("/api/google-reviews")
            .then((res) => res.json())
            .then((data) => {
                if (data.reviews && data.reviews.length > 0) {
                    setTestimonialsData(data.reviews.slice(0, 6));
                    if (data.rating) setGoogleRating(data.rating);
                    if (data.totalReviews) setTotalCount(data.totalReviews);
                }
            })
            .catch(() => {});
    }, []);

    const N = testimonialsData.length;
    const extendedData = [...testimonialsData, ...testimonialsData, ...testimonialsData];

    const [currentIndex, setCurrentIndex] = useState(N);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const isAnimating = useRef(false);
    const [prevLength, setPrevLength] = useState(N);

    if (prevLength !== N) {
        setPrevLength(N);
        setCurrentIndex(N);
    }

    const handleNext = () => {
        if (isAnimating.current) return;
        isAnimating.current = true;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (isAnimating.current) return;
        isAnimating.current = true;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    };

    const handleTransitionEnd = () => {
        isAnimating.current = false;
        if (currentIndex >= 2 * N) {
            setIsTransitioning(false);
            setCurrentIndex(currentIndex - N);
        } else if (currentIndex < N) {
            setIsTransitioning(false);
            setCurrentIndex(currentIndex + N);
        }
    };

    return (
        <section id="testimonials" className="bg-white py-24 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <SectionHeader
                    subtitle="OUR TESTIMONIALS"
                    title="Cheers From Our Clients"
                />

                {/* Google Verified Review Badge Box */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 bg-purple-50/60 border border-purple-100 rounded-2xl p-4 sm:px-8 sm:py-4 max-w-xl mx-auto mt-6 shadow-xs">
                    <div className="flex items-center gap-3">
                        <GoogleGIcon />
                        <span className="font-bold text-slate-800 text-lg sm:text-xl">
                            {googleRating}
                        </span>
                        <div className="flex text-purple-600 text-base tracking-wider">
                            ★★★★★
                        </div>
                    </div>
                    <div className="h-4 w-px bg-purple-200 hidden sm:block" />
                    <a
                        href="https://www.google.com/search?q=orchid+photography"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-semibold text-purple-700 hover:text-purple-900 transition-colors flex items-center gap-1.5"
                    >
                        <span>Verified on Google ({totalCount}+ Reviews)</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>

                {/* Testimonials Carousel Container */}
                <div className="relative mt-12">
                    <button
                        onClick={handlePrev}
                        aria-label="Previous Testimonials"
                        className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-zinc-800/80 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={handleNext}
                        aria-label="Next Testimonials"
                        className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-zinc-800/80 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div className="overflow-hidden w-full px-1 py-1">
                        <div
                            onTransitionEnd={handleTransitionEnd}
                            className={`flex -mx-3 ${
                                isTransitioning ? "transition-transform duration-500 ease-in-out" : "transition-none"
                            }`}
                            style={{
                                transform: `translateX(-${(currentIndex * 100) / 3}%)`,
                            }}
                        >
                            {extendedData.map((item, idx) => (
                                <div
                                    key={`${item.id}-${idx}`}
                                    className="w-full md:w-1/3 shrink-0 px-3 flex flex-col"
                                >
                                    <div className="bg-white border border-purple-100/80 shadow-xs p-6 rounded-2xl flex flex-col justify-between h-full min-h-55 transition-all hover:shadow-md hover:border-purple-200">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full ${item.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
                                                        {item.initials}
                                                    </div>
                                                    <span className="font-semibold text-zinc-900 text-sm">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <GoogleGIcon />
                                            </div>

                                            <div className="flex gap-1 text-purple-500 text-sm mb-3">
                                                {"★".repeat(item.rating)}
                                            </div>

                                            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
