import HeroSlider from "@/components/HeroSlider";
import ServicesSection, { kidsServicesData } from "@/components/ServicesSection";
import FeaturedVideoSection from "@/components/FeaturedVideoSection";
import GalleryGridSection from "@/components/GalleryGridSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import StatsCounterSection from "@/components/StatsCounterSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogsSection from "@/components/BlogsSection";
import { getSiteSettings, getGalleryMedia, getHeroCarouselMedia } from "@/lib/data/settings";
import { getBlogs } from "@/lib/data/blogs";

// This is the kidography home page — served at "/" on the kidography
// subdomain via a proxy rewrite (see proxy.ts), and also directly reachable
// at this path. Mirrors app/(public)/page.tsx section-for-section, swapping
// in the kids-audience data for the 4 sections that differ (hero carousel,
// specializations, video, gallery); the rest of the site is shared.
export const revalidate = 86400;

export default async function KidographyPage() {
    const [settings, kidsGalleryImages, heroImages, blogPosts] = await Promise.all([
        getSiteSettings(),
        getGalleryMedia("kids"),
        getHeroCarouselMedia("kids"),
        getBlogs(),
    ]);

    return (
        <>
            {/* Home (Hero) Section with automatic background image slider, curated in the admin panel */}
            <HeroSlider images={heroImages} />

            {/* 3-Column Kids Photography Services Grid Section, images sourced from the kids gallery */}
            <ServicesSection
                images={kidsGalleryImages}
                services={kidsServicesData}
                subtitle="Our Specializations"
                title="Orchid Kidography"
                description="Capturing Playful, Precious Childhood Moments, Serving Families All Over India"
            />

            {/* Large Autoplay Video Showcase Section */}
            <FeaturedVideoSection videoUrl={settings.kidsHeroVideoUrl ?? undefined} />

            {/* Dynamic Gallery Grid Showcase Section */}
            <GalleryGridSection
                images={kidsGalleryImages}
                subtitle="Specialized Kidography"
                title="Capturing Pure Smiles & Timeless Memories"
            />

            {/* Why We Are Rated Top Photographer Section */}
            <WhyChooseUsSection />

            {/* Animated Stats Counter Section */}
            <StatsCounterSection stats={settings.stats} />

            {/* Client Testimonials Section */}
            <TestimonialsSection />

            {/* Blogs Section */}
            <BlogsSection posts={blogPosts} />
        </>
    );
}
