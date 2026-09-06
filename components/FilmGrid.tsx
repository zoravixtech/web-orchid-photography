"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Film } from "@/lib/types";

interface FilmGridProps {
    films: Film[];
}

export default function FilmGrid({ films }: FilmGridProps) {
    const [activeFilm, setActiveFilm] = useState<Film | null>(null);

    const closeLightbox = useCallback(() => {
        setActiveFilm(null);
    }, []);

    // Handle ESC key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeLightbox();
            }
        };

        if (activeFilm) {
            window.addEventListener("keydown", handleKeyDown);
            // Lock body scroll
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [activeFilm, closeLightbox]);

    if (films.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-xl mx-auto px-6 my-8">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Films Available Yet</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Cinematic wedding films and video highlights will be published here soon.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {films.map((film) => (
                    <div
                        key={film.id}
                        onClick={() => setActiveFilm(film)}
                        className="group relative aspect-video rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-slate-900 border border-slate-200/40"
                    >
                        {/* Thumbnail */}
                        <Image
                            src={film.thumbnailUrl}
                            alt={film.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors duration-300" />

                        {/* Gold / Amber Play Button */}
                        <button
                            type="button"
                            aria-label={`Play ${film.title}`}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-7 py-3 sm:px-9 sm:py-3.5 rounded-xl bg-[rgb(245,196,99)]/75 group-hover:bg-[rgb(245,196,99)] text-white shadow-xl backdrop-blur-xs transition-all duration-300 transform group-hover:scale-110 flex items-center justify-center pointer-events-none"
                        >
                            <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white translate-x-0.5 drop-shadow-sm" viewBox="0 0 448 512">
                                <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
                            </svg>
                        </button>

                        {/* Bottom Title Bar */}
                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                            <p className="text-white text-sm sm:text-base font-semibold truncate drop-shadow-md">
                                {film.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Interactive YouTube Lightbox Modal */}
            {activeFilm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={closeLightbox}
                >
                    <div
                        className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={closeLightbox}
                            className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg hover:scale-110"
                            aria-label="Close video player"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Responsive YouTube Player */}
                        <iframe
                            src={`https://www.youtube.com/embed/${activeFilm.videoId}?autoplay=1&rel=0`}
                            title={activeFilm.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full border-0"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
