import type { Metadata } from "next";
import FilmGrid from "@/components/FilmGrid";
import { getFilms } from "@/lib/data/films";

export const metadata: Metadata = {
    title: "Best Wedding Films | The Orchid Photography",
    description: "Make your best moment more special through Best Wedding Videography by The Orchid Photography. We have expertise with a highly professional wedding Photography & Videography team in Kolkata.",
};

export const revalidate = 3600;

export default async function FilmsPage() {
    const films = await getFilms();

    return (
        <main className="min-h-screen bg-[#f8f9fa]">
            {/* Video Hero Section matching https://rigbiswas.com/films/marwari-wedding */}
            <div className="relative w-full h-[55vh] min-h-[380px] max-h-[560px] overflow-hidden flex items-center justify-center bg-black">
                <video
                    id="hero-video"
                    preload="metadata"
                    playsInline
                    autoPlay
                    muted
                    loop
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover pointer-events-none opacity-80"
                >
                    <source
                        src="https://res.cloudinary.com/dhzllfqqt/video/upload/v1684439815/Home_Page_Mashup_Videod_xqgwtx.mp4"
                        type="video/mp4"
                    />
                </video>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/55 z-10" />

                {/* Hero Title & Description */}
                <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-lg font-serif">
                        Best Wedding Films From Orchid Photography
                    </h1>
                    <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
                        Make your best moment more special through Best Wedding Videography by Orchid Photography. We have expertise with a highly professional wedding Photography &amp; Videography team in Kolkata.
                    </p>
                </div>
            </div>

            {/* Light Wrapper with 3-Column Video Tiles */}
            <section className="wrapper light-wrapper py-14 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FilmGrid films={films} />
                </div>
            </section>
        </main>
    );
}
