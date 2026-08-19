"use client";

import { useEffect, useRef } from "react";

export default function FeaturedVideoSection({ videoUrl }: { videoUrl?: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoUrl && videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch((err) => {
                console.log("Autoplay video interaction fallback:", err);
            });
        }
    }, [videoUrl]);

    if (!videoUrl) return null;

    return (
        <section className="bg-white py-16 px-4 sm:px-8">
            <div className="max-w-[1600px] mx-auto">
                {/* Large Video Container with aspect ratio */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-950 shadow-2xl">
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover pointer-events-none select-none"
                    >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </section>
    );
}
