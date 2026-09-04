import HeroSlider from "@/components/HeroSlider";
import AlbumsGridSection from "@/components/AlbumsGridSection";
import FeaturedVideoSection from "@/components/FeaturedVideoSection";
import GalleryGridSection from "@/components/GalleryGridSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import StatsCounterSection from "@/components/StatsCounterSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogsSection from "@/components/BlogsSection";
import { getSiteSettings, getPinnedMedia, getHeroCarouselMedia } from "@/lib/data/settings";
import { getAlbums } from "@/lib/data/albums";
import { getBlogs } from "@/lib/data/blogs";

// Serve cached HTML for a long time; content is invalidated on-demand from the admin panel.
export const revalidate = 86400;

export default async function Home() {
    const [settings, albums, pinnedImages, heroImages, blogPosts] = await Promise.all([
        getSiteSettings("orchid"),
        getAlbums("orchid"),
        getPinnedMedia("orchid"),
        getHeroCarouselMedia("orchid"),
        getBlogs(),
    ]);

    return (
        <>
            {/* Home (Hero) Section with automatic background image slider, curated in the admin panel */}
            <HeroSlider images={heroImages} />

            {/* Albums Grid Section — click through to an album's own gallery page */}
            <AlbumsGridSection albums={albums} albumHrefBase="/albums" />

            {/* Large Autoplay Video Showcase Section */}
            <FeaturedVideoSection videoUrl={settings.heroVideoUrl ?? undefined} />

            {/* Pinned images from every category, with a link to the full tabbed gallery */}
            <GalleryGridSection images={pinnedImages} showMoreHref="/gallery" />

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
