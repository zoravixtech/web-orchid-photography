"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { PlatformLogo } from "@/components/PlatformLogo";
import type { Review } from "@/lib/types";

export function ReviewCard({ review }: { review: Review }) {
    if (review.type === "video") {
        return <VideoReviewCard review={review} />;
    }
    return <TextReviewCard review={review} />;
}

export function TextReviewCard({ review }: { review: Review }) {
    const initial = review.name ? review.name.charAt(0).toUpperCase() : "?";

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 hover:shadow-md transition-shadow break-inside-avoid mb-6 flex flex-col justify-between">
            <div>
                {/* Header: User Info & Platform Logo */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 shadow-xs">
                            {review.userImage ? (
                                <Image
                                    src={review.userImage}
                                    alt={review.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <span className="font-bold text-sm text-purple-700">
                                    {initial}
                                </span>
                            )}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm leading-tight">
                            {review.name}
                        </span>
                    </div>

                    <div className="shrink-0 mt-0.5">
                        <PlatformLogo platform={review.platform} className="w-5 h-5" />
                    </div>
                </div>

                {/* Stars Rating */}
                <div className="flex items-center gap-0.5 text-amber-400 text-sm tracking-wider mt-3 mb-2.5">
                    {"★".repeat(Math.max(1, Math.min(5, review.stars)))}
                </div>

                {/* Review Message */}
                {review.message && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {review.message}
                    </p>
                )}
            </div>
        </div>
    );
}

export function VideoReviewCard({ review }: { review: Review }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleMouseEnter = () => {
        if (!videoRef.current) return;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
    };

    const handleMouseLeave = () => {
        if (!videoRef.current) return;
        videoRef.current.pause();
        setIsPlaying(false);
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    return (
        <div
            onClick={togglePlay}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative rounded-2xl overflow-hidden bg-black shadow-xs hover:shadow-xl transition-all cursor-pointer break-inside-avoid mb-6 aspect-9/14 sm:aspect-9/15"
        >
            {/* Video element */}
            <video
                ref={videoRef}
                src={review.videoUrl ?? undefined}
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            {/* Top right mute/unmute control */}
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                    {isMuted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Bottom Overlay Info (Matching Screenshot) */}
            <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between pointer-events-none z-10">
                {/* Bottom Left Play/Pause Icon */}
                <div className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-xs">
                    {isPlaying ? (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                        </svg>
                    ) : (
                        <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </div>

                {/* Bottom Right Stars + User Name */}
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-0.5 text-amber-400 text-xs tracking-wider mb-1 drop-shadow-xs">
                        {"★".repeat(Math.max(1, Math.min(5, review.stars)))}
                    </div>
                    <span className="text-white text-xs sm:text-sm font-semibold tracking-wide text-right drop-shadow-md">
                        {review.name}
                    </span>
                </div>
            </div>
        </div>
    );
}
