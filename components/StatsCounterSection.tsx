"use client";

import { useEffect, useRef, useState } from "react";
import type { StatsCounters } from "@/lib/types";

function WeddingsIcon() {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none"
        >
            {/* Left scarf sash (Pink/Red) */}
            <path
                d="M32 38 C22 42, 16 52, 12 66 C18 68, 24 66, 28 58 C32 50, 36 44, 38 40 Z"
                fill="#F43F5E"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Left fringe tassels (Gold) */}
            <path
                d="M12 66 L9 73 M15 67 L13 74 M19 67 L18 75 M22 65 L22 72"
                stroke="#FACC15"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M12 66 L9 73 M15 67 L13 74 M19 67 L18 75 M22 65 L22 72"
                stroke="#1E293B"
                strokeWidth="1"
                strokeLinecap="round"
            />

            {/* Right scarf sash (Yellow/Gold) */}
            <path
                d="M48 38 C58 42, 64 52, 68 66 C62 68, 56 66, 52 58 C48 50, 44 44, 42 40 Z"
                fill="#FACC15"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Right fringe tassels (Pink) */}
            <path
                d="M68 66 L71 73 M65 67 L67 74 M61 67 L62 75 M58 65 L58 72"
                stroke="#F43F5E"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M68 66 L71 73 M65 67 L67 74 M61 67 L62 75 M58 65 L58 72"
                stroke="#1E293B"
                strokeWidth="1"
                strokeLinecap="round"
            />

            {/* Upper Left sash band (Pink) */}
            <path
                d="M16 22 C22 28, 30 34, 38 38 L34 43 C26 38, 18 32, 12 26 Z"
                fill="#F43F5E"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Upper Right sash band (Yellow) */}
            <path
                d="M64 22 C58 28, 50 34, 42 38 L46 43 C54 38, 62 32, 68 26 Z"
                fill="#FACC15"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Center knot tie (Red with Gold tie ring) */}
            <path
                d="M34 33 C34 30, 46 30, 46 33 C46 42, 34 42, 34 33 Z"
                fill="#EF4444"
                stroke="#1E293B"
                strokeWidth="2.5"
            />
            <ellipse
                cx="40"
                cy="36.5"
                rx="4"
                ry="5.5"
                fill="#FACC15"
                stroke="#1E293B"
                strokeWidth="2"
            />
        </svg>
    );
}

function PreWeddingsIcon() {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none"
        >
            {/* Left sleeve (Pink) */}
            <path
                d="M8 20 L24 28 L18 48 L2 40 Z"
                fill="#EC4899"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Left sleeve cuff detail */}
            <path
                d="M20 26 L23 27.5 L18 43.5 L15 42 Z"
                fill="#F472B6"
                stroke="#1E293B"
                strokeWidth="1.5"
            />

            {/* Right sleeve (Terracotta/Orange) */}
            <path
                d="M72 20 L56 28 L62 48 L78 40 Z"
                fill="#F97316"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Right sleeve cuff detail */}
            <path
                d="M60 26 L57 27.5 L62 43.5 L65 42 Z"
                fill="#FB923C"
                stroke="#1E293B"
                strokeWidth="1.5"
            />

            {/* Left Hand Arm & Fingers holding */}
            <path
                d="M22 30 C30 34, 35 38, 40 40 C44 42, 46 39, 44 35 C40 31, 35 29, 26 27 Z"
                fill="#FDBA74"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Right Hand & Fingers wrapped */}
            <path
                d="M58 30 C50 34, 44 38, 38 41 C34 43, 31 47, 33 52 C36 57, 43 54, 48 48 L56 42 Z"
                fill="#FED7AA"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Intertwined Fingers Detail Lines */}
            <path
                d="M35 41 C37 46, 40 50, 44 51"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M40 38 C42 42, 45 45, 48 46"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function BabyPhotoshootsIcon() {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none"
        >
            {/* Top Left Heart */}
            <path
                d="M18 18 C18 15 20 13 22.5 13 C25 13 27 15 27 17.5 C27 21 22.5 24 22.5 24 C22.5 24 18 21 18 17.5 Z"
                fill="#F472B6"
                stroke="#1E293B"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            {/* Top Right Heart */}
            <path
                d="M56 16 C56 13.5 57.8 11.5 60 11.5 C62.2 11.5 64 13.5 64 15.5 C64 18.5 60 21 60 21 C60 21 56 18.5 56 15.5 Z"
                fill="#EC4899"
                stroke="#1E293B"
                strokeWidth="2"
                strokeLinejoin="round"
            />

            {/* Adult Hand Palm facing up */}
            <path
                d="M24 66 L24 54 C24 46, 26 40, 32 35 C38 30, 46 28, 54 30 C62 32, 68 40, 68 48 C68 56, 62 64, 54 66 Z"
                fill="#FDBA74"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Adult Thumb */}
            <path
                d="M54 30 C58 26, 64 27, 66 31 C68 35, 65 39, 60 41"
                fill="#FDBA74"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Baby Hand Resting inside Adult Hand */}
            <path
                d="M32 54 C30 46, 33 38, 38 35 C43 32, 48 35, 51 40 C53 45, 48 51, 42 54 Z"
                fill="#FED7AA"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Baby Fingers */}
            <path
                d="M35 38 C33 35, 30 36, 31 40"
                stroke="#1E293B"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />
            <path
                d="M39 35 C38 32, 35 33, 36 37"
                stroke="#1E293B"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />
            <path
                d="M43 34 C43 31, 40 32, 41 36"
                stroke="#1E293B"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />
            <path
                d="M47 35 C48 32, 45 32, 45 36"
                stroke="#1E293B"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CorporateInteriorIcon() {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none"
        >
            {/* Floor Lamp on Left */}
            <path
                d="M12 30 L20 20 L28 30 Z"
                fill="#FACC15"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            <path
                d="M20 30 L20 66"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M14 66 L26 66"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Framed Picture on Wall */}
            <rect
                x="34"
                y="14"
                width="28"
                height="20"
                rx="2"
                fill="#E0F2FE"
                stroke="#1E293B"
                strokeWidth="2.5"
            />
            <circle cx="41" cy="20" r="3" fill="#FACC15" />
            <path
                d="M36 31 L43 23 L51 31 Z"
                fill="#34D399"
                stroke="#1E293B"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M46 31 L52 24 L58 31 Z"
                fill="#059669"
                stroke="#1E293B"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />

            {/* Sofa / Couch in Foreground */}
            <rect
                x="28"
                y="42"
                width="46"
                height="22"
                rx="4"
                fill="#F97316"
                stroke="#1E293B"
                strokeWidth="2.5"
            />
            <path
                d="M30 42 L30 52 C30 54, 50 54, 51 52 L51 42"
                fill="#FB923C"
                stroke="#1E293B"
                strokeWidth="2"
            />
            <path
                d="M51 42 L51 52 C51 54, 72 54, 72 52 L72 42"
                fill="#FB923C"
                stroke="#1E293B"
                strokeWidth="2"
            />
            <rect
                x="26"
                y="44"
                width="6"
                height="18"
                rx="2"
                fill="#EA580C"
                stroke="#1E293B"
                strokeWidth="2"
            />
            <rect
                x="70"
                y="44"
                width="6"
                height="18"
                rx="2"
                fill="#EA580C"
                stroke="#1E293B"
                strokeWidth="2"
            />
            <path
                d="M32 64 L32 68 M70 64 L70 68"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

interface StatItem {
    id: string;
    statsKey: keyof StatsCounters;
    suffix: string;
    label: string;
    icon: React.ComponentType;
}

const statsData: StatItem[] = [
    {
        id: "weddings",
        statsKey: "weddings",
        suffix: "+",
        label: "WEDDINGS",
        icon: WeddingsIcon,
    },
    {
        id: "pre-weddings",
        statsKey: "preWeddings",
        suffix: "+",
        label: "PRE WEDDINGS",
        icon: PreWeddingsIcon,
    },
    {
        id: "baby-photoshoots",
        statsKey: "babyPhotoshoots",
        suffix: "+",
        label: "BABY PHOTOSHOOTS",
        icon: BabyPhotoshootsIcon,
    },
    {
        id: "corporate-interior",
        statsKey: "corporateInterior",
        suffix: "+",
        label: "CORPORATE & INTERIOR",
        icon: CorporateInteriorIcon,
    },
];

function AnimatedCounter({
    targetValue,
    suffix,
    isVisible,
}: {
    targetValue: number;
    suffix: string;
    isVisible: boolean;
}) {
    const [count, setCount] = useState(0);
    const [prevVisible, setPrevVisible] = useState(isVisible);

    if (prevVisible !== isVisible) {
        setPrevVisible(isVisible);
        if (!isVisible) setCount(0);
    }

    useEffect(() => {
        if (!isVisible) {
            return;
        }

        const duration = 2000; // 2 seconds
        const frameRate = 1000 / 60; // 60 fps
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.min(
                Math.round(easeOutProgress * targetValue),
                targetValue
            );

            setCount(currentCount);

            if (frame >= totalFrames) {
                clearInterval(timer);
                setCount(targetValue);
            }
        }, frameRate);

        return () => clearInterval(timer);
    }, [isVisible, targetValue]);

    return (
        <span className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-none">
            {count}
            {suffix}
        </span>
    );
}

export default function StatsCounterSection({ stats }: { stats: StatsCounters }) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section className="bg-white py-12 sm:py-16 px-4 sm:px-6">
            <div ref={sectionRef} className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {statsData.map((stat) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={stat.id}
                                className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border border-purple-100/80 flex flex-row items-center gap-4 sm:gap-5 transition-transform hover:-translate-y-1 duration-300"
                            >
                                <IconComponent />
                                <div className="flex flex-col items-start justify-center">
                                    <AnimatedCounter
                                        targetValue={stats[stat.statsKey]}
                                        suffix={stat.suffix}
                                        isVisible={isVisible}
                                    />
                                    <span className="text-xs sm:text-xs md:text-sm font-bold text-slate-600 tracking-wider uppercase mt-1 leading-snug">
                                        {stat.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

