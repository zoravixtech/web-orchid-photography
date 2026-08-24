"use client";

import { useEffect, useRef } from "react";

export default function FeaturedVideoSection({ videoUrl }: { videoUrl?: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoUrl || !videoElement) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    videoElement.play().catch((err) => {
                        console.log("Video play error:", err);
                    });
                } else {
                    videoElement.pause();
                }
            },
            { threshold: 0.4 }
        );

        observer.observe(videoElement);

        return () => {
            observer.disconnect();
        };
    }, [videoUrl]);

    if (!videoUrl) return null;

    return (
        <section className="bg-white py-16 px-4 sm:px-8">
            <div className="max-w-[1600px] mx-auto">
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-950 shadow-2xl">
                    <video
                        ref={videoRef}
                        loop
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </section>
    );
}
