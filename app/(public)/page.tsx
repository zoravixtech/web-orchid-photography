import HeroSlider from "@/components/HeroSlider";
import ServicesSection from "@/components/ServicesSection";
import FeaturedVideoSection from "@/components/FeaturedVideoSection";
import GalleryGridSection from "@/components/GalleryGridSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import StatsCounterSection from "@/components/StatsCounterSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogsSection from "@/components/BlogsSection";
import { getSiteSettings, getGalleryMedia, getHeroCarouselMedia } from "@/lib/data/settings";
import { getBlogs } from "@/lib/data/blogs";

// Serve cached HTML for a long time; content is invalidated on-demand from the admin panel.
export const revalidate = 86400;

export default async function Home() {
    const [settings, galleryImages, heroImages, blogPosts] = await Promise.all([
        getSiteSettings(),
        getGalleryMedia("gallery"),
        getHeroCarouselMedia("gallery"),
        getBlogs(),
    ]);

    return (
        <>
            {/* Home (Hero) Section with automatic background image slider, curated in the admin panel */}
            <HeroSlider images={heroImages} />

            {/* 3-Column Photography Services Grid Section, images sourced from the gallery */}
            <ServicesSection images={galleryImages} />

            {/* Large Autoplay Video Showcase Section */}
            <FeaturedVideoSection videoUrl={settings.heroVideoUrl ?? undefined} />

            {/* Dynamic Gallery Grid Showcase Section */}
            <GalleryGridSection images={galleryImages} />

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