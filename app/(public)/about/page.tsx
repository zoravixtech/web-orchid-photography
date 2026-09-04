import type { Metadata } from "next";
import Image from "next/image";
import AboutStorySection from "@/components/about/AboutStorySection";
import AboutTeamSection from "@/components/about/AboutTeamSection";
import AboutOfficeSection from "@/components/about/AboutOfficeSection";

export const metadata: Metadata = {
    title: "About Us | Premier Wedding Photographers in Kolkata",
    description:
        "Learn about The Orchid Photography, Kolkata's leading wedding photography team. Discover our story, meet our passionate photographers and cinematographers, and take a studio tour!",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Top Hero Breadcrumb Banner */}
            <div className="relative py-24 sm:py-32 mt-32 bg-slate-950 text-white overflow-hidden">
                {/* Background Cover Image */}
                <Image
                    src="https://images.prismic.io/chobirkotha2/ZwwH8oF3NbkBXXt5_ARG_9438.jpg?auto=format,compress&rect=0,0,6017,4011&w=1920&h=1080"
                    alt="The Orchid Photography About Header"
                    fill
                    priority
                    className="object-cover object-center opacity-35"
                    sizes="100vw"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-slate-950/80 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-center flex flex-col items-center z-10">
                    <span className="font-serif text-xs font-semibold tracking-[0.3em] uppercase text-purple-400 mb-3 block">
                        The Orchid Photography
                    </span>
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-4">
                        About <span className="italic font-normal text-purple-400">Us</span>
                    </h1>
                    <p className="font-serif text-sm sm:text-base tracking-wide text-slate-300 max-w-2xl leading-relaxed">
                        At The Orchid Photography, we capture your love story, transforming wedding moments into timeless memories filled with joy and emotion.
                    </p>
                </div>
            </div>

            {/* Section 1: Story & Overview */}
            <AboutStorySection />

            {/* Section 2: Meet Our Team */}
            <AboutTeamSection />

            {/* Section 3: Office & Studio Tour */}
            <AboutOfficeSection />
        </div>
    );
}
